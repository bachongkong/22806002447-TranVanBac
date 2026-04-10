import { apiClient, API } from '@shared/services'

const cvService = {
  // Lấy danh sách CV
  getMyCvs: () => apiClient.get(API.CVS.BASE),

  // Tạo CV Online (Builder)
  createOnlineCv: (data) => apiClient.post(API.CVS.BASE, data),

  // Cập nhật CV Online
  updateOnlineCv: (id, data) => apiClient.put(API.CVS.BY_ID(id), data),

  // Upload tĩnh 1 CV PDF
  uploadCv: (formData) => apiClient.post(API.CVS.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Set default
  setDefault: (id) => apiClient.patch(API.CVS.SET_DEFAULT(id)),

  // Parse text từ màn Preview (sử dụng parameter thay vì route path tĩnh nếu cần gọi qua parse route, 
  // vì backend cvController ignore params id, ở đây dùng id 'preview' dummy)
  parseOcrPreview: (formData) => apiClient.post(API.CVS.PARSE_OCR('preview'), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Xóa CV
  deleteCv: (id) => apiClient.delete(API.CVS.BY_ID(id)),
}

export default cvService
