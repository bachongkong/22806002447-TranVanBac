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

  // ── HR Member Management ──

  listHrMembers: async (req, res) => {
    const result = await companyService.listHrMembers(
      req.params.id,
      req.user.userId
    )

    ApiResponse.success(res, {
      message: 'Lấy danh sách thành viên thành công',
      data: result,
    })
  },

  addHrMember: async (req, res) => {
    const company = await companyService.addHrMember(
      req.params.id,
      req.user.userId,
      req.body.email
    )

    ApiResponse.success(res, {
      message: 'Thêm thành viên thành công',
      data: company,
    })
  },

  removeHrMember: async (req, res) => {
    const company = await companyService.removeHrMember(
      req.params.id,
      req.user.userId,
      req.params.memberId
    )

    ApiResponse.success(res, {
      message: 'Xóa thành viên thành công',
      data: company,
    })
  },
}

export default companyController
