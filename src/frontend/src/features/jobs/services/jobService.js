import { apiClient, API } from '@shared/services'

const jobService = {
  getAll: (params) => apiClient.get(API.JOBS.BASE, { params }),
  getById: (id) => apiClient.get(API.JOBS.BY_ID(id)),
  search: (params) => apiClient.get(API.JOBS.SEARCH, { params }),
  create: (data) => apiClient.post(API.JOBS.BASE, data),
  update: (id, data) => apiClient.put(API.JOBS.BY_ID(id), data),
  delete: (id) => apiClient.delete(API.JOBS.BY_ID(id)),
  getByCompany: (companyId, params) => apiClient.get(API.JOBS.BY_COMPANY(companyId), { params }),
  getFavorites: () => apiClient.get(API.JOBS.FAVORITES),
  toggleFavorite: (id) => apiClient.post(API.JOBS.TOGGLE_FAVORITE(id)),
}

export default jobService
