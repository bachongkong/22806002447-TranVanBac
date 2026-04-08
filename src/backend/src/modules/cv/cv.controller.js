import { ApiResponse, ApiError } from '../../common/index.js'
import cvService from './cv.service.js'

const cvController = {
  listMyCvs: async (req, res) => {
    const cvs = await cvService.listMyCvs(req.user.userId)
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

    const cv = await cvService.uploadCv(req.user.userId, buffer, originalname, title)
    
    ApiResponse.created(res, {
      message: 'Tải lên CV thành công',
      data: cv,
    })
  },

  createOnlineCv: async (req, res) => {
    const cv = await cvService.createOnlineCv(req.user.userId, req.body)
    ApiResponse.created(res, {
      message: 'Tạo hồ sơ CV thành công',
      data: cv,
    })
  },

  updateOnlineCv: async (req, res) => {
    const { id } = req.params
    const cv = await cvService.updateOnlineCv(req.user.userId, id, req.body)
    ApiResponse.success(res, {
      message: 'Cập nhật nội dung hồ sơ tải lên thành công',
      data: cv,
    })
  },

  setDefaultCv: async (req, res) => {
    const { id } = req.params
    const cv = await cvService.setDefaultCv(req.user.userId, id)
    ApiResponse.success(res, {
      message: 'Đặt CV làm mặc định thành công',
      data: cv,
    })
  },

  deleteCv: async (req, res) => {
    const { id } = req.params
    await cvService.deleteCv(req.user.userId, id)
    ApiResponse.success(res, {
      message: 'Xóa CV thành công',
    })
  },

  parseOcr: async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('Vui lòng cung cấp file CV (PDF)')
    }

    const { buffer, mimetype } = req.file
    const parsedText = await cvService.parseCVText(buffer, mimetype)

    ApiResponse.success(res, {
      message: 'Trích xuất văn bản từ CV thành công',
      data: {
        text: parsedText,
      },
    })
  },
}

export default cvController
