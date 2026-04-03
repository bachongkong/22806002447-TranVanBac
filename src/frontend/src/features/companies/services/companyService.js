import { apiClient, API } from '@shared/services'

const companyService = {
  getAll: (params) => apiClient.get(API.COMPANIES.BASE, { params }),
  getById: (id) => apiClient.get(API.COMPANIES.BY_ID(id)),
  getMyCompany: () => apiClient.get(API.COMPANIES.MY_COMPANY),
  create: (data) => apiClient.post(API.COMPANIES.BASE, data),
  update: (id, data) => apiClient.put(API.COMPANIES.BY_ID(id), data),
  getMembers: (id) => apiClient.get(API.COMPANIES.MEMBERS(id)),
  addMember: (id, data) => apiClient.post(API.COMPANIES.MEMBERS(id), data),
  removeMember: (id, memberId) => apiClient.delete(API.COMPANIES.REMOVE_MEMBER(id, memberId)),
  uploadLogo: (id, formData) => apiClient.patch(API.COMPANIES.UPLOAD_LOGO(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export default companyService
