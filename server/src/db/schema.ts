import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'principal', 'company', 'admin']);
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'approved', 'rejected', 'interviewed', 'hired']);
export const accountStatusEnum = pgEnum('account_status', ['pending', 'approved', 'rejected', 'suspended']);
export const eventStatusEnum = pgEnum('event_status', ['draft', 'published', 'ongoing', 'completed', 'cancelled']);

// Users table - base authentication table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  status: accountStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  approved_by: integer('approved_by'), // References users.id for admin who approved
  approved_at: timestamp('approved_at')
});

// Student profiles table
export const studentProfilesTable = pgTable('student_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  student_id: text('student_id').notNull().unique(), // School student ID
  full_name: text('full_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  graduation_year: integer('graduation_year').notNull(),
  major: text('major').notNull(), // Study major/specialization
  gpa: integer('gpa'), // Grade point average (nullable)
  skills: text('skills'), // Comma-separated skills or JSON
  cv_file_url: text('cv_file_url'), // URL to uploaded CV
  photo_url: text('photo_url'), // Profile photo URL
  is_verified: boolean('is_verified').notNull().default(false),
  verified_by: integer('verified_by'), // References users.id (teacher who verified)
  verified_at: timestamp('verified_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Teacher profiles table
export const teacherProfilesTable = pgTable('teacher_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  teacher_id: text('teacher_id').notNull().unique(), // School teacher ID
  full_name: text('full_name').notNull(),
  phone: text('phone').notNull(),
  department: text('department').notNull(), // Teaching department
  position: text('position'), // Job position/title
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Principal profiles table
export const principalProfilesTable = pgTable('principal_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  full_name: text('full_name').notNull(),
  phone: text('phone').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Company profiles table
export const companyProfilesTable = pgTable('company_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  company_name: text('company_name').notNull(),
  company_address: text('company_address').notNull(),
  industry: text('industry').notNull(),
  company_size: text('company_size'), // e.g., "1-50", "51-200", etc.
  contact_person: text('contact_person').notNull(),
  contact_phone: text('contact_phone').notNull(),
  website: text('website'),
  description: text('description'),
  logo_url: text('logo_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Admin profiles table
export const adminProfilesTable = pgTable('admin_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  full_name: text('full_name').notNull(),
  phone: text('phone').notNull(),
  position: text('position').notNull(), // Administrative position
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Job postings table
export const jobPostingsTable = pgTable('job_postings', {
  id: serial('id').primaryKey(),
  company_id: integer('company_id').notNull().references(() => companyProfilesTable.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  salary_range: text('salary_range'), // e.g., "3-5 million IDR"
  location: text('location').notNull(),
  employment_type: text('employment_type').notNull(), // full-time, part-time, contract
  application_deadline: timestamp('application_deadline').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Job applications table
export const jobApplicationsTable = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentProfilesTable.id),
  job_posting_id: integer('job_posting_id').notNull().references(() => jobPostingsTable.id),
  cover_letter: text('cover_letter'),
  status: applicationStatusEnum('status').notNull().default('pending'),
  applied_at: timestamp('applied_at').defaultNow().notNull(),
  reviewed_at: timestamp('reviewed_at'),
  interview_date: timestamp('interview_date'),
  interview_location: text('interview_location'),
  notes: text('notes') // Additional notes from company/admin
});

// Job fair events table
export const jobFairEventsTable = pgTable('job_fair_events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  event_date: timestamp('event_date').notNull(),
  location: text('location').notNull(),
  registration_deadline: timestamp('registration_deadline').notNull(),
  status: eventStatusEnum('status').notNull().default('draft'),
  created_by: integer('created_by').notNull().references(() => usersTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Event registrations table (for job fair events)
export const eventRegistrationsTable = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull().references(() => jobFairEventsTable.id),
  student_id: integer('student_id').notNull().references(() => studentProfilesTable.id),
  registration_date: timestamp('registration_date').defaultNow().notNull(),
  card_printed: boolean('card_printed').notNull().default(false),
  card_printed_at: timestamp('card_printed_at'),
  card_printed_by: integer('card_printed_by'), // References users.id (who printed the card)
  test_schedule: timestamp('test_schedule'), // Scheduled test/interview time
  additional_info: text('additional_info') // What to bring, location details, etc.
});

// Relations
export const usersRelations = relations(usersTable, ({ one }) => ({
  studentProfile: one(studentProfilesTable, {
    fields: [usersTable.id],
    references: [studentProfilesTable.user_id]
  }),
  teacherProfile: one(teacherProfilesTable, {
    fields: [usersTable.id],
    references: [teacherProfilesTable.user_id]
  }),
  principalProfile: one(principalProfilesTable, {
    fields: [usersTable.id],
    references: [principalProfilesTable.user_id]
  }),
  companyProfile: one(companyProfilesTable, {
    fields: [usersTable.id],
    references: [companyProfilesTable.user_id]
  }),
  adminProfile: one(adminProfilesTable, {
    fields: [usersTable.id],
    references: [adminProfilesTable.user_id]
  }),
  approver: one(usersTable, {
    fields: [usersTable.approved_by],
    references: [usersTable.id]
  })
}));

export const studentProfilesRelations = relations(studentProfilesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentProfilesTable.user_id],
    references: [usersTable.id]
  }),
  verifier: one(usersTable, {
    fields: [studentProfilesTable.verified_by],
    references: [usersTable.id]
  }),
  applications: many(jobApplicationsTable),
  eventRegistrations: many(eventRegistrationsTable)
}));

export const companyProfilesRelations = relations(companyProfilesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [companyProfilesTable.user_id],
    references: [usersTable.id]
  }),
  jobPostings: many(jobPostingsTable)
}));

export const jobPostingsRelations = relations(jobPostingsTable, ({ one, many }) => ({
  company: one(companyProfilesTable, {
    fields: [jobPostingsTable.company_id],
    references: [companyProfilesTable.id]
  }),
  applications: many(jobApplicationsTable)
}));

export const jobApplicationsRelations = relations(jobApplicationsTable, ({ one }) => ({
  student: one(studentProfilesTable, {
    fields: [jobApplicationsTable.student_id],
    references: [studentProfilesTable.id]
  }),
  jobPosting: one(jobPostingsTable, {
    fields: [jobApplicationsTable.job_posting_id],
    references: [jobPostingsTable.id]
  })
}));

export const jobFairEventsRelations = relations(jobFairEventsTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [jobFairEventsTable.created_by],
    references: [usersTable.id]
  }),
  registrations: many(eventRegistrationsTable)
}));

export const eventRegistrationsRelations = relations(eventRegistrationsTable, ({ one }) => ({
  event: one(jobFairEventsTable, {
    fields: [eventRegistrationsTable.event_id],
    references: [jobFairEventsTable.id]
  }),
  student: one(studentProfilesTable, {
    fields: [eventRegistrationsTable.student_id],
    references: [studentProfilesTable.id]
  }),
  cardPrinter: one(usersTable, {
    fields: [eventRegistrationsTable.card_printed_by],
    references: [usersTable.id]
  })
}));

// Export all tables for drizzle query building
export const tables = {
  users: usersTable,
  studentProfiles: studentProfilesTable,
  teacherProfiles: teacherProfilesTable,
  principalProfiles: principalProfilesTable,
  companyProfiles: companyProfilesTable,
  adminProfiles: adminProfilesTable,
  jobPostings: jobPostingsTable,
  jobApplications: jobApplicationsTable,
  jobFairEvents: jobFairEventsTable,
  eventRegistrations: eventRegistrationsTable
};