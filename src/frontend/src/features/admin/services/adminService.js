import { apiClient, API } from '@shared/services'

const adminService = {
  // --- Companies Moderation ---
  getPendingCompanies: (params) => apiClient.get(API.ADMIN.PENDING_COMPANIES, { params }),
  approveCompany: (id) => apiClient.patch(API.ADMIN.APPROVE_COMPANY(id)),
  rejectCompany: (id) => apiClient.patch(API.ADMIN.REJECT_COMPANY(id)),
  lockCompany: (id) => apiClient.patch(API.ADMIN.LOCK_COMPANY(id)),
  
  // Note: users and jobs moderation endpoints can be added here when needed
}

export default adminService
