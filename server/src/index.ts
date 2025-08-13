import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { z } from 'zod';
import {
  createUserInputSchema,
  createStudentProfileInputSchema,
  createJobPostingInputSchema,
  createJobApplicationInputSchema,
  createJobFairEventInputSchema,
  createEventRegistrationInputSchema,
  updateJobApplicationStatusInputSchema,
  approveAccountInputSchema,
  verifyStudentInputSchema,
  printCardInputSchema
} from './schema';

// Import handlers
import { registerUser, loginUser, getUserById } from './handlers/auth';
import { 
  createStudentProfile, 
  getStudentProfile, 
  getStudentProfiles, 
  verifyStudent,
  updateStudentProfile 
} from './handlers/student_profile';
import { 
  createCompanyProfile, 
  getCompanyProfile, 
  getCompanyProfiles,
  updateCompanyProfile 
} from './handlers/company_profile';
import { 
  createJobPosting, 
  getJobPostings, 
  getJobPostingById,
  updateJobPosting,
  deactivateJobPosting 
} from './handlers/job_postings';
import { 
  createJobApplication, 
  getJobApplications, 
  getJobApplicationById,
  updateJobApplicationStatus,
  getStudentApplications,
  getCompanyApplications 
} from './handlers/job_applications';
import { 
  createJobFairEvent, 
  getJobFairEvents, 
  getJobFairEventById,
  updateJobFairEvent,
  publishJobFairEvent,
  registerForJobFairEvent,
  getEventRegistrations 
} from './handlers/job_fair_events';
import { 
  printCard, 
  generateCardData, 
  getCardHistory,
  updateTestSchedule 
} from './handlers/card_management';
import { 
  approveAccount, 
  getPendingAccounts, 
  suspendAccount,
  getAllUsers,
  deleteUser,
  createAdminProfile,
  createTeacherProfile,
  createPrincipalProfile 
} from './handlers/admin_management';
import { 
  getApplicationStatistics, 
  getJobPostingStatistics,
  getStudentStatistics,
  getCompanyStatistics,
  getJobFairEventStatistics,
  generatePeriodReport 
} from './handlers/reporting';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    register: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => registerUser(input)),
    
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(({ input }) => loginUser(input.email, input.password)),
    
    me: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getUserById(input.id))
  }),

  // Student profile routes
  students: router({
    create: publicProcedure
      .input(createStudentProfileInputSchema)
      .mutation(({ input }) => createStudentProfile(input)),
    
    getProfile: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => getStudentProfile(input.userId)),
    
    getAll: publicProcedure
      .query(() => getStudentProfiles()),
    
    verify: publicProcedure
      .input(verifyStudentInputSchema)
      .mutation(({ input }) => verifyStudent(input)),
    
    update: publicProcedure
      .input(z.object({ userId: z.number(), updates: createStudentProfileInputSchema.partial() }))
      .mutation(({ input }) => updateStudentProfile(input.userId, input.updates)),
    
    getApplications: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => getStudentApplications(input.studentId))
  }),

  // Company profile routes
  companies: router({
    create: publicProcedure
      .input(z.object({
        user_id: z.number(),
        company_name: z.string(),
        company_address: z.string(),
        industry: z.string(),
        company_size: z.string().optional(),
        contact_person: z.string(),
        contact_phone: z.string(),
        website: z.string().optional(),
        description: z.string().optional(),
        logo_url: z.string().optional()
      }))
      .mutation(({ input }) => createCompanyProfile(input)),
    
    getProfile: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => getCompanyProfile(input.userId)),
    
    getAll: publicProcedure
      .query(() => getCompanyProfiles()),
    
    update: publicProcedure
      .input(z.object({ 
        userId: z.number(), 
        updates: z.object({
          company_name: z.string().optional(),
          company_address: z.string().optional(),
          industry: z.string().optional(),
          company_size: z.string().optional(),
          contact_person: z.string().optional(),
          contact_phone: z.string().optional(),
          website: z.string().optional(),
          description: z.string().optional(),
          logo_url: z.string().optional()
        })
      }))
      .mutation(({ input }) => updateCompanyProfile(input.userId, input.updates)),
    
    getApplications: publicProcedure
      .input(z.object({ companyId: z.number() }))
      .query(({ input }) => getCompanyApplications(input.companyId))
  }),

  // Job posting routes
  jobs: router({
    create: publicProcedure
      .input(createJobPostingInputSchema)
      .mutation(({ input }) => createJobPosting(input)),
    
    getAll: publicProcedure
      .input(z.object({ 
        company_id: z.number().optional(),
        is_active: z.boolean().optional(),
        search: z.string().optional()
      }))
      .query(({ input }) => getJobPostings(input)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getJobPostingById(input.id)),
    
    update: publicProcedure
      .input(z.object({ id: z.number(), updates: createJobPostingInputSchema.partial() }))
      .mutation(({ input }) => updateJobPosting(input.id, input.updates)),
    
    deactivate: publicProcedure
      .input(z.object({ id: z.number(), companyId: z.number() }))
      .mutation(({ input }) => deactivateJobPosting(input.id, input.companyId))
  }),

  // Job application routes
  applications: router({
    create: publicProcedure
      .input(createJobApplicationInputSchema)
      .mutation(({ input }) => createJobApplication(input)),
    
    getAll: publicProcedure
      .input(z.object({ 
        student_id: z.number().optional(),
        job_posting_id: z.number().optional(),
        company_id: z.number().optional(),
        status: z.string().optional()
      }))
      .query(({ input }) => getJobApplications(input)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getJobApplicationById(input.id)),
    
    updateStatus: publicProcedure
      .input(updateJobApplicationStatusInputSchema)
      .mutation(({ input }) => updateJobApplicationStatus(input))
  }),

  // Job fair event routes
  events: router({
    create: publicProcedure
      .input(createJobFairEventInputSchema)
      .mutation(({ input }) => createJobFairEvent(input)),
    
    getAll: publicProcedure
      .input(z.object({ status: z.string().optional(), created_by: z.number().optional() }))
      .query(({ input }) => getJobFairEvents(input)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getJobFairEventById(input.id)),
    
    update: publicProcedure
      .input(z.object({ id: z.number(), updates: createJobFairEventInputSchema.partial() }))
      .mutation(({ input }) => updateJobFairEvent(input.id, input.updates)),
    
    publish: publicProcedure
      .input(z.object({ id: z.number(), publisherId: z.number() }))
      .mutation(({ input }) => publishJobFairEvent(input.id, input.publisherId)),
    
    register: publicProcedure
      .input(createEventRegistrationInputSchema)
      .mutation(({ input }) => registerForJobFairEvent(input)),
    
    getRegistrations: publicProcedure
      .input(z.object({ eventId: z.number().optional(), studentId: z.number().optional() }))
      .query(({ input }) => getEventRegistrations(input.eventId, input.studentId))
  }),

  // Card management routes
  cards: router({
    print: publicProcedure
      .input(printCardInputSchema)
      .mutation(({ input }) => printCard(input)),
    
    generateData: publicProcedure
      .input(z.object({ registrationId: z.number() }))
      .query(({ input }) => generateCardData(input.registrationId)),
    
    getHistory: publicProcedure
      .input(z.object({ student_id: z.number().optional(), printed_by: z.number().optional(), event_id: z.number().optional() }))
      .query(({ input }) => getCardHistory(input)),
    
    updateTestSchedule: publicProcedure
      .input(z.object({ registrationId: z.number(), testSchedule: z.coerce.date(), additionalInfo: z.string().optional() }))
      .mutation(({ input }) => updateTestSchedule(input.registrationId, input.testSchedule, input.additionalInfo))
  }),

  // Admin management routes
  admin: router({
    approveAccount: publicProcedure
      .input(approveAccountInputSchema)
      .mutation(({ input }) => approveAccount(input)),
    
    getPendingAccounts: publicProcedure
      .query(() => getPendingAccounts()),
    
    suspendAccount: publicProcedure
      .input(z.object({ userId: z.number(), suspendedBy: z.number() }))
      .mutation(({ input }) => suspendAccount(input.userId, input.suspendedBy)),
    
    getAllUsers: publicProcedure
      .input(z.object({ role: z.string().optional(), status: z.string().optional() }))
      .query(({ input }) => getAllUsers(input)),
    
    deleteUser: publicProcedure
      .input(z.object({ userId: z.number(), deletedBy: z.number() }))
      .mutation(({ input }) => deleteUser(input.userId, input.deletedBy)),
    
    createAdminProfile: publicProcedure
      .input(z.object({ user_id: z.number(), full_name: z.string(), phone: z.string(), position: z.string() }))
      .mutation(({ input }) => createAdminProfile(input)),
    
    createTeacherProfile: publicProcedure
      .input(z.object({ 
        user_id: z.number(), 
        teacher_id: z.string(), 
        full_name: z.string(), 
        phone: z.string(), 
        department: z.string(), 
        position: z.string().optional()
      }))
      .mutation(({ input }) => createTeacherProfile(input)),
    
    createPrincipalProfile: publicProcedure
      .input(z.object({ user_id: z.number(), full_name: z.string(), phone: z.string() }))
      .mutation(({ input }) => createPrincipalProfile(input))
  }),

  // Reporting routes
  reports: router({
    applicationStats: publicProcedure
      .input(z.object({ year: z.number().optional(), month: z.number().optional(), company_id: z.number().optional() }))
      .query(({ input }) => getApplicationStatistics(input)),
    
    jobPostingStats: publicProcedure
      .input(z.object({ year: z.number().optional(), month: z.number().optional(), company_id: z.number().optional() }))
      .query(({ input }) => getJobPostingStatistics(input)),
    
    studentStats: publicProcedure
      .input(z.object({ graduation_year: z.number().optional(), major: z.string().optional(), is_verified: z.boolean().optional() }))
      .query(({ input }) => getStudentStatistics(input)),
    
    companyStats: publicProcedure
      .query(() => getCompanyStatistics()),
    
    eventStats: publicProcedure
      .input(z.object({ eventId: z.number().optional() }))
      .query(({ input }) => getJobFairEventStatistics(input.eventId)),
    
    periodReport: publicProcedure
      .input(z.object({ 
        start_date: z.coerce.date(), 
        end_date: z.coerce.date(),
        include_students: z.boolean().optional(),
        include_applications: z.boolean().optional(),
        include_companies: z.boolean().optional(),
        include_events: z.boolean().optional()
      }))
      .query(({ input }) => generatePeriodReport(input))
  })
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Job Fair SMK TRPC server listening at port: ${port}`);
}

start();