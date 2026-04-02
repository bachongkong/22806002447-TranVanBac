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
