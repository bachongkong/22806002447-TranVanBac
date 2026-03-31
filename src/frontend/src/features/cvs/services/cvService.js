import { apiClient, API } from '@shared/services'

const cvService = {
  getAll: () => apiClient.get(API.CVS.BASE),
  getById: (id) => apiClient.get(API.CVS.BY_ID(id)),
  upload: (formData) => apiClient.post(API.CVS.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  create: (data) => apiClient.post(API.CVS.BASE, data),
  update: (id, data) => apiClient.put(API.CVS.BY_ID(id), data),
  delete: (id) => apiClient.delete(API.CVS.BY_ID(id)),
  setDefault: (id) => apiClient.patch(API.CVS.SET_DEFAULT(id)),
  parseOCR: (id) => apiClient.post(API.CVS.PARSE_OCR(id)),
}

export default cvService
