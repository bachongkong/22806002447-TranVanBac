import { apiClient, API } from '@shared/services'

const companyService = {
  getAll: (params) => apiClient.get(API.COMPANIES.BASE, { params }),
  getById: (id) => apiClient.get(API.COMPANIES.BY_ID(id)),
  getMyCompany: () => apiClient.get(API.COMPANIES.MY_COMPANY),
  create: (data) => apiClient.post(API.COMPANIES.BASE, data),
  update: (id, data) => apiClient.put(API.COMPANIES.BY_ID(id), data),
  getMembers: (id) => apiClient.get(API.COMPANIES.MEMBERS(id)),
}

export default companyService
