import { ApiResponse, ApiError } from '../../common/index.js'
import cvService from './cv.service.js'

const cvController = {
  listMyCvs: async (req, res) => {
    const cvs = await cvService.listMyCvs(req.user.id)
    ApiResponse.success(res, {
      message: 'Lấy danh sách CV thành công',
      data: cvs,
    })
  },

  uploadCv: async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('Vui lòng cung cấp file CV (PDF hoặc Word)')
    }

    const { buffer, originalname } = req.file
    const title = req.body.title || originalname

    const cv = await cvService.uploadCv(req.user.id, buffer, originalname, title)
    
    ApiResponse.created(res, {
      message: 'Tải lên CV thành công',
      data: cv,
    })
  },

  createOnlineCv: async (req, res) => {
    const cv = await cvService.createOnlineCv(req.user.id, req.body)
    ApiResponse.created(res, {
      message: 'Tạo hồ sơ CV thành công',
      data: cv,
    })
  },

  updateOnlineCv: async (req, res) => {
    const { id } = req.params
    const cv = await cvService.updateOnlineCv(req.user.id, id, req.body)
    ApiResponse.success(res, {
      message: 'Cập nhật nội dung hồ sơ tải lên thành công',
      data: cv,
    })
  },

  setDefaultCv: async (req, res) => {
    const { id } = req.params
    const cv = await cvService.setDefaultCv(req.user.id, id)
    ApiResponse.success(res, {
      message: 'Đặt CV làm mặc định thành công',
      data: cv,
    })
  },

  deleteCv: async (req, res) => {
    const { id } = req.params
    await cvService.deleteCv(req.user.id, id)
    ApiResponse.success(res, {
      message: 'Xóa CV thành công',
    })
  },
import { ApiResponse } from '../../common/index.js'
import cvService from './cv.service.js'

const cvController = {
  parseOcr: async (req, res) => {
    // req.file do middleware 'upload' (multer memoryStorage) đính kèm
    if (!req.file) {
      return ApiResponse.success(res, {
        statusCode: 400,
        message: 'Vui lòng cung cấp file CV (PDF)',
      })
    }

    const { buffer, mimetype } = req.file

    // Đưa vào service xử lý
    const parsedText = await cvService.parseCVText(buffer, mimetype)

    ApiResponse.success(res, {
      message: 'Trích xuất văn bản từ CV thành công',
      data: {
        text: parsedText,
        // Tuỳ nhu cầu phần sau có thể lưu extracted data vào DB tuỳ luồng
      },
    })
  },
  
  // Các controller stub cho tương lai...
  listMyCvs: async (req, res) => {
    ApiResponse.success(res, { message: 'List CVs — chưa implement' })
  },

  uploadCv: async (req, res) => {
    ApiResponse.created(res, { message: 'Upload CV — chưa implement' })
  },

  createCv: async (req, res) => {
    ApiResponse.created(res, { message: 'Create CV (Builder) — chưa implement' })
  },

  updateCv: async (req, res) => {
    ApiResponse.success(res, { message: 'Update CV — chưa implement' })
  },

  deleteCv: async (req, res) => {
    ApiResponse.success(res, { message: 'Delete CV — chưa implement' })
  },

  setDefaultCv: async (req, res) => {
    ApiResponse.success(res, { message: 'Set default CV — chưa implement' })
  }
}

export default cvController
