import { ApiError, ApiResponse } from '../../common/index.js'
import companyService from './company.service.js'

// ============================================
// Company Controller
// ============================================

const companyController = {
  createCompany: async (req, res) => {
    const company = await companyService.createCompany(req.user.userId, req.body)

    ApiResponse.created(res, {
      message: 'Táº¡o cÃ´ng ty thÃ nh cÃ´ng. Äang chá» Admin duyá»‡t.',
      data: company,
    })
  },

  getMyCompany: async (req, res) => {
    const company = await companyService.getMyCompany(req.user.userId)

    ApiResponse.success(res, {
      message: 'Láº¥y thÃ´ng tin cÃ´ng ty thÃ nh cÃ´ng',
      data: company,
    })
  },

  getCompanyById: async (req, res) => {
    const company = await companyService.getCompanyById(req.params.id)

    ApiResponse.success(res, {
      message: 'Láº¥y thÃ´ng tin cÃ´ng ty thÃ nh cÃ´ng',
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
      message: 'Cáº­p nháº­t thÃ´ng tin cÃ´ng ty thÃ nh cÃ´ng',
      data: company,
    })
  },

  uploadLogo: async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('Vui lÃ²ng chá»n file áº£nh Ä‘á»ƒ upload')
    }

    const company = await companyService.uploadLogo(
      req.params.id,
      req.user.userId,
      req.file.buffer,
      req.file.originalname
    )

    ApiResponse.success(res, {
      message: 'Cáº­p nháº­t logo thÃ nh cÃ´ng',
      data: company,
    })
  },

  // â”€â”€ HR Member Management â”€â”€

  listHrMembers: async (req, res) => {
    const result = await companyService.listHrMembers(
      req.params.id,
      req.user.userId
    )

    ApiResponse.success(res, {
      message: 'Láº¥y danh sÃ¡ch thÃ nh viÃªn thÃ nh cÃ´ng',
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
      message: 'ThÃªm thÃ nh viÃªn thÃ nh cÃ´ng',
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
      message: 'XÃ³a thÃ nh viÃªn thÃ nh cÃ´ng',
      data: company,
    })
  },
}

export default companyController
