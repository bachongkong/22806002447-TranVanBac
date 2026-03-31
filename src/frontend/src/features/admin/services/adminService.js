import { apiClient, API } from '@shared/services'

const adminService = {
  // Users
  getUsers: (params) => apiClient.get(API.ADMIN.USERS, { params }),
  getUserById: (id) => apiClient.get(API.ADMIN.USER_BY_ID(id)),
  toggleBlockUser: (id) => apiClient.patch(API.ADMIN.TOGGLE_BLOCK(id)),

  // Companies
  getPendingCompanies: (params) => apiClient.get(API.ADMIN.PENDING_COMPANIES, { params }),
  approveCompany: (id) => apiClient.patch(API.ADMIN.APPROVE_COMPANY(id)),
  rejectCompany: (id, data) => apiClient.patch(API.ADMIN.REJECT_COMPANY(id), data),

  // Jobs
  getPendingJobs: (params) => apiClient.get(API.ADMIN.PENDING_JOBS, { params }),
  approveJob: (id) => apiClient.patch(API.ADMIN.APPROVE_JOB(id)),
  rejectJob: (id, data) => apiClient.patch(API.ADMIN.REJECT_JOB(id), data),

  // Dashboard
  getDashboard: () => apiClient.get(API.ADMIN.DASHBOARD),

  // Taxonomy
  getCategories: () => apiClient.get(API.ADMIN.CATEGORIES),
  getSkills: () => apiClient.get(API.ADMIN.SKILLS),
  getLocations: () => apiClient.get(API.ADMIN.LOCATIONS),
}

export default adminService
