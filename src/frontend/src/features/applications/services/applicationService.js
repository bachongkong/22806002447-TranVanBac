import { apiClient, API } from '@shared/services'

const applicationService = {
  apply: (data, config) => apiClient.post(API.APPLICATIONS.BASE, data, config),
  getMyApplications: (params) => apiClient.get(API.APPLICATIONS.MY_APPLICATIONS, { params }),
  getById: (id) => apiClient.get(API.APPLICATIONS.BY_ID(id)),
  getByJob: (jobId, params) => apiClient.get(API.APPLICATIONS.BY_JOB(jobId), { params }),
  updateStatus: (id, data) => apiClient.patch(API.APPLICATIONS.UPDATE_STATUS(id), data),
  withdraw: (id) => apiClient.patch(API.APPLICATIONS.WITHDRAW(id)),
}

export default applicationService
