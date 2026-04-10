import { apiClient, API } from '@shared/services'

const interviewService = {
  getAll: (params) => apiClient.get(API.INTERVIEWS.BASE, { params }),
  getById: (id) => apiClient.get(API.INTERVIEWS.BY_ID(id)),
  getByApplication: (appId) => apiClient.get(API.INTERVIEWS.BY_APPLICATION(appId)),
  create: (data) => apiClient.post(API.INTERVIEWS.BASE, data),
  update: (id, data) => apiClient.put(API.INTERVIEWS.BY_ID(id), data),
}

export default interviewService
