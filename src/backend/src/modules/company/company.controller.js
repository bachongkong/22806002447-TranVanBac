import { ApiResponse } from '../../common/index.js'
import companyService from './company.service.js'

// ============================================
// Company Controller
// ============================================

const companyController = {
  createCompany: async (req, res) => {
    const company = await companyService.createCompany(req.user.userId, req.body)

    ApiResponse.created(res, {
      message: 'Tạo công ty thành công. Đang chờ Admin duyệt.',
      data: company,
    })
  },

  getMyCompany: async (req, res) => {
    const company = await companyService.getMyCompany(req.user.userId)

    ApiResponse.success(res, {
      message: 'Lấy thông tin công ty thành công',
      data: company,
    })
  },

  getCompanyById: async (req, res) => {
    const company = await companyService.getCompanyById(req.params.id)

    ApiResponse.success(res, {
      message: 'Lấy thông tin công ty thành công',
      data: company,
    })
  },

  listCompanies: async (req, res) => {
    const { companies, total } = await companyService.listCompanies(req.query)

    ApiResponse.paginated(res, {
      data: companies,
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      total,
    })
  },

  updateCompany: async (req, res) => {
    const company = await companyService.updateCompany(
      req.params.id,
      req.user.userId,
      req.body
    )

    ApiResponse.success(res, {
      message: 'Cập nhật thông tin công ty thành công',
      data: company,
    })
  },

  uploadLogo: async (req, res) => {
    if (!req.file) {
      return ApiResponse.success(res, {
        statusCode: 400,
        message: 'Vui lòng chọn file ảnh để upload',
      })
    }

    const company = await companyService.uploadLogo(
      req.params.id,
      req.user.userId,
      req.file.buffer,
      req.file.originalname
    )

    ApiResponse.success(res, {
      message: 'Cập nhật logo thành công',
      data: company,
    })
  },
}

export default companyController
