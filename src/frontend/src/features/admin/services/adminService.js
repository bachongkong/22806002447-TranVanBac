import { API, apiClient } from '@shared/services'

const adminService = {
  getPendingCompanies: (params) => apiClient.get(API.ADMIN.PENDING_COMPANIES, { params }),
  approveCompany: (id) => apiClient.patch(API.ADMIN.APPROVE_COMPANY(id)),
  rejectCompany: (id) => apiClient.patch(API.ADMIN.REJECT_COMPANY(id)),
  lockCompany: (id) => apiClient.patch(API.ADMIN.LOCK_COMPANY(id)),
  getDashboardStats: () => apiClient.get(API.ADMIN.DASHBOARD),
}

export default adminService
