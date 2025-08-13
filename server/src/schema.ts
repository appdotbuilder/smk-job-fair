import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['student', 'teacher', 'principal', 'company', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

// Job application status enum
export const applicationStatusSchema = z.enum(['pending', 'approved', 'rejected', 'interviewed', 'hired']);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

// Account status enum
export const accountStatusSchema = z.enum(['pending', 'approved', 'rejected', 'suspended']);
export type AccountStatus = z.infer<typeof accountStatusSchema>;

// Event status enum
export const eventStatusSchema = z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']);
export type EventStatus = z.infer<typeof eventStatusSchema>;

// Base user schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  role: userRoleSchema,
  status: accountStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  approved_by: z.number().nullable(),
  approved_at: z.coerce.date().nullable()
});

export type User = z.infer<typeof userSchema>;

// Student profile schema
export const studentProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  student_id: z.string(),
  full_name: z.string(),
  phone: z.string(),
  address: z.string(),
  graduation_year: z.number().int(),
  major: z.string(),
  gpa: z.number().nullable(),
  skills: z.string().nullable(),
  cv_file_url: z.string().nullable(),
  photo_url: z.string().nullable(),
  is_verified: z.boolean(),
  verified_by: z.number().nullable(),
  verified_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type StudentProfile = z.infer<typeof studentProfileSchema>;

// Teacher profile schema
export const teacherProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  teacher_id: z.string(),
  full_name: z.string(),
  phone: z.string(),
  department: z.string(),
  position: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type TeacherProfile = z.infer<typeof teacherProfileSchema>;

// Principal profile schema
export const principalProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  full_name: z.string(),
  phone: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type PrincipalProfile = z.infer<typeof principalProfileSchema>;

// Company profile schema
export const companyProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  company_name: z.string(),
  company_address: z.string(),
  industry: z.string(),
  company_size: z.string().nullable(),
  contact_person: z.string(),
  contact_phone: z.string(),
  website: z.string().nullable(),
  description: z.string().nullable(),
  logo_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CompanyProfile = z.infer<typeof companyProfileSchema>;

// Admin profile schema
export const adminProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  full_name: z.string(),
  phone: z.string(),
  position: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AdminProfile = z.infer<typeof adminProfileSchema>;

// Job posting schema
export const jobPostingSchema = z.object({
  id: z.number(),
  company_id: z.number(),
  title: z.string(),
  description: z.string(),
  requirements: z.string(),
  salary_range: z.string().nullable(),
  location: z.string(),
  employment_type: z.string(),
  application_deadline: z.coerce.date(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type JobPosting = z.infer<typeof jobPostingSchema>;

// Job application schema
export const jobApplicationSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  job_posting_id: z.number(),
  cover_letter: z.string().nullable(),
  status: applicationStatusSchema,
  applied_at: z.coerce.date(),
  reviewed_at: z.coerce.date().nullable(),
  interview_date: z.coerce.date().nullable(),
  interview_location: z.string().nullable(),
  notes: z.string().nullable()
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;

// Job fair event schema
export const jobFairEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  event_date: z.coerce.date(),
  location: z.string(),
  registration_deadline: z.coerce.date(),
  status: eventStatusSchema,
  created_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type JobFairEvent = z.infer<typeof jobFairEventSchema>;

// Event registration schema
export const eventRegistrationSchema = z.object({
  id: z.number(),
  event_id: z.number(),
  student_id: z.number(),
  registration_date: z.coerce.date(),
  card_printed: z.boolean(),
  card_printed_at: z.coerce.date().nullable(),
  card_printed_by: z.number().nullable(),
  test_schedule: z.coerce.date().nullable(),
  additional_info: z.string().nullable()
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

// Input schemas for creating users
export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleSchema
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Input schemas for student profile
export const createStudentProfileInputSchema = z.object({
  user_id: z.number(),
  student_id: z.string(),
  full_name: z.string(),
  phone: z.string(),
  address: z.string(),
  graduation_year: z.number().int(),
  major: z.string(),
  gpa: z.number().nullable().optional(),
  skills: z.string().nullable().optional(),
  cv_file_url: z.string().nullable().optional(),
  photo_url: z.string().nullable().optional()
});

export type CreateStudentProfileInput = z.infer<typeof createStudentProfileInputSchema>;

// Input schemas for job posting
export const createJobPostingInputSchema = z.object({
  company_id: z.number(),
  title: z.string(),
  description: z.string(),
  requirements: z.string(),
  salary_range: z.string().nullable().optional(),
  location: z.string(),
  employment_type: z.string(),
  application_deadline: z.coerce.date()
});

export type CreateJobPostingInput = z.infer<typeof createJobPostingInputSchema>;

// Input schemas for job application
export const createJobApplicationInputSchema = z.object({
  student_id: z.number(),
  job_posting_id: z.number(),
  cover_letter: z.string().nullable().optional()
});

export type CreateJobApplicationInput = z.infer<typeof createJobApplicationInputSchema>;

// Input schemas for job fair event
export const createJobFairEventInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  event_date: z.coerce.date(),
  location: z.string(),
  registration_deadline: z.coerce.date(),
  created_by: z.number()
});

export type CreateJobFairEventInput = z.infer<typeof createJobFairEventInputSchema>;

// Input schemas for event registration
export const createEventRegistrationInputSchema = z.object({
  event_id: z.number(),
  student_id: z.number(),
  test_schedule: z.coerce.date().nullable().optional(),
  additional_info: z.string().nullable().optional()
});

export type CreateEventRegistrationInput = z.infer<typeof createEventRegistrationInputSchema>;

// Update schemas
export const updateJobApplicationStatusInputSchema = z.object({
  id: z.number(),
  status: applicationStatusSchema,
  interview_date: z.coerce.date().nullable().optional(),
  interview_location: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

export type UpdateJobApplicationStatusInput = z.infer<typeof updateJobApplicationStatusInputSchema>;

export const approveAccountInputSchema = z.object({
  user_id: z.number(),
  approved_by: z.number(),
  status: z.enum(['approved', 'rejected'])
});

export type ApproveAccountInput = z.infer<typeof approveAccountInputSchema>;

export const verifyStudentInputSchema = z.object({
  student_id: z.number(),
  verified_by: z.number(),
  is_verified: z.boolean()
});

export type VerifyStudentInput = z.infer<typeof verifyStudentInputSchema>;

export const printCardInputSchema = z.object({
  registration_id: z.number(),
  printed_by: z.number()
});

export type PrintCardInput = z.infer<typeof printCardInputSchema>;