// ============================================
// Application Constants
// ============================================

export const ROLES = {
  CANDIDATE: 'candidate',
  HR: 'hr',
  ADMIN: 'admin',
}

export const JOB_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  CLOSED: 'closed',
}

export const APPLICATION_STATUS = {
  SUBMITTED: 'submitted',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEWED: 'interviewed',
  OFFERED: 'offered',
  HIRED: 'hired',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
}

export const COMPANY_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const USER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
}

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
]

export const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher' },
  { value: 'junior', label: 'Junior (1-2 năm)' },
  { value: 'mid', label: 'Mid (2-5 năm)' },
  { value: 'senior', label: 'Senior (5+ năm)' },
  { value: 'lead', label: 'Lead / Manager' },
]

export const INTERVIEW_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
]

export const CV_SOURCE_TYPES = {
  UPLOAD: 'upload',
  BUILDER: 'builder',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 20, 50],
}
