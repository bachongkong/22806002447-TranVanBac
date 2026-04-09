import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'
import Company from '../../models/Company.js'
import User from '../../models/User.js'
import { ApiError } from '../../common/index.js'
import { COMPANY_STATUS, ROLES } from '../../common/constants.js'

// ============================================
// Helpers
// ============================================

const LOGO_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'logos')

/**
 * Đảm bảo thư mục upload tồn tại
 */
const ensureUploadDir = async () => {
  await fs.mkdir(LOGO_UPLOAD_DIR, { recursive: true })
}

/**
 * Kiểm tra HR có thuộc company không
 */
const assertHrBelongsToCompany = (company, userId) => {
  const isMember = company.hrMembers.some(
    (memberId) => memberId.toString() === userId
  )
  if (!isMember) {
    throw ApiError.forbidden('Bạn không có quyền chỉnh sửa công ty này')
  }
}

// ============================================
// Company Service
// ============================================

const companyService = {
  /**
   * Tạo Company mới — chỉ HR, mỗi HR chỉ được tạo 1 company
   * @param {string} userId
   * @param {Object} data
   * @returns {Object} company
   */
  createCompany: async (userId, data) => {
    // Kiểm tra HR đã có company chưa
    const user = await User.findById(userId)
    if (!user) {
      throw ApiError.notFound('Không tìm thấy tài khoản')
    }
    if (user.companyId) {
      throw ApiError.conflict('Bạn đã có công ty. Mỗi HR chỉ được tạo 1 công ty.')
    }

    // Tạo company — status mặc định PENDING
    const company = await Company.create({
      ...data,
      status: COMPANY_STATUS.PENDING,
      createdBy: userId,
      hrMembers: [userId],
    })

    // Cập nhật companyId cho user
    user.companyId = company._id
    await user.save()

    return company
  },

  /**
   * Lấy company của HR đang đăng nhập
   * @param {string} userId
   * @returns {Object} company
   */
  getMyCompany: async (userId) => {
    const user = await User.findById(userId)
    if (!user || !user.companyId) {
      throw ApiError.notFound('Bạn chưa có công ty nào')
    }

    const company = await Company.findById(user.companyId)
      .populate('hrMembers', 'email profile.fullName profile.avatar profile.phone')
      .populate('createdBy', 'email profile.fullName profile.avatar')

    if (!company) {
      throw ApiError.notFound('Không tìm thấy công ty')
    }

    return company
  },

  /**
   * Lấy company theo ID (public)
   * @param {string} companyId
   * @returns {Object} company
   */
  getCompanyById: async (companyId) => {
    const company = await Company.findById(companyId)
      .populate('hrMembers', 'email profile.fullName profile.avatar profile.phone')
      .populate('createdBy', 'email profile.fullName profile.avatar')

    if (!company) {
      throw ApiError.notFound('Không tìm thấy công ty')
    }

    return company
  },

  /**
   * Danh sách companies (public — chỉ hiện approved)
   * @param {{ page, limit, search, industry }} query
   * @returns {{ companies, total }}
   */
  listCompanies: async ({ page = 1, limit = 10, search, industry }) => {
    const filter = { status: COMPANY_STATUS.APPROVED }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }
    if (industry) {
      filter.industry = { $regex: industry, $options: 'i' }
    }

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .select('-hrMembers')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Company.countDocuments(filter),
    ])

    return { companies, total }
  },

  /**
   * Cập nhật thông tin company — chỉ HR thuộc hrMembers
   * @param {string} companyId
   * @param {string} userId
   * @param {Object} data
   * @returns {Object} company
   */
  updateCompany: async (companyId, userId, data) => {
    const company = await Company.findById(companyId)
    if (!company) {
      throw ApiError.notFound('Không tìm thấy công ty')
    }

    assertHrBelongsToCompany(company, userId)

    // Cập nhật fields — không cho thay đổi status, createdBy, hrMembers
    const allowedFields = [
      'name', 'description', 'website', 'industry',
      'companySize', 'location', 'socialLinks',
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        company[field] = data[field]
      }
    }

    await company.save()

    return company
  },

  /**
   * Upload / thay đổi logo company
   * @param {string} companyId
   * @param {string} userId
   * @param {Buffer} fileBuffer - Buffer ảnh từ multer
   * @param {string} originalName - Tên file gốc
   * @returns {Object} company với logo URL mới
   */
  uploadLogo: async (companyId, userId, fileBuffer, originalName) => {
    const company = await Company.findById(companyId)
    if (!company) {
      throw ApiError.notFound('Không tìm thấy công ty')
    }

    assertHrBelongsToCompany(company, userId)

    // Đảm bảo thư mục upload tồn tại
    await ensureUploadDir()

    // Tạo tên file unique — luôn dùng .png vì sharp convert sang PNG
    const filename = `logo-${companyId}-${Date.now()}.png`
    const filepath = path.join(LOGO_UPLOAD_DIR, filename)

    // Resize & optimize bằng sharp
    await sharp(fileBuffer)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 85 })
      .toFile(filepath)

    // Xóa logo cũ (nếu có)
    if (company.logo) {
      const oldFilename = company.logo.split('/').pop()
      const oldPath = path.join(LOGO_UPLOAD_DIR, oldFilename)
      await fs.unlink(oldPath).catch(() => {
        // Ignore nếu file cũ không tồn tại
      })
    }

    // Cập nhật logo URL
    company.logo = `/public/uploads/logos/${filename}`
    await company.save()

    return company
  },

  // ============================================
  // HR Member Management
  // ============================================

  /**
   * Danh sách HR members của company
   * @param {string} companyId
   * @param {string} userId - HR đang đăng nhập (phải thuộc company)
   * @returns {Array} members
   */
  listHrMembers: async (companyId, userId) => {
    const company = await Company.findById(companyId)
      .populate('hrMembers', 'email profile.fullName profile.avatar profile.phone')
      .populate('createdBy', 'email profile.fullName')

    if (!company) {
      throw ApiError.notFound('Không tìm thấy công ty')
    }

    assertHrBelongsToCompany(company, userId)

    return {
      members: company.hrMembers,
      createdBy: company.createdBy,
    }
  },

  /**
   * Thêm HR member vào company
   * @param {string} companyId
   * @param {string} userId - HR đang thực hiện (phải thuộc company)
   * @param {string} email - Email của HR cần thêm
   * @returns {Object} company đã cập nhật
   */
  addHrMember: async (companyId, userId, email) => {
    const company = await Company.findById(companyId)
    if (!company) {
      throw ApiError.notFound('Không tìm thấy công ty')
    }

    assertHrBelongsToCompany(company, userId)

    // Tìm user theo email
    const targetUser = await User.findOne({ email })
    if (!targetUser) {
      throw ApiError.notFound(`Không tìm thấy tài khoản với email: ${email}`)
    }

    // Kiểm tra role phải là HR
    if (targetUser.role !== ROLES.HR) {
      throw ApiError.badRequest('Chỉ có thể thêm tài khoản có role HR vào công ty')
    }

    // Kiểm tra đã thuộc company này chưa
    const alreadyMember = company.hrMembers.some(
      (memberId) => memberId.toString() === targetUser._id.toString()
    )
    if (alreadyMember) {
      throw ApiError.conflict('Thành viên này đã thuộc công ty')
    }

    // Kiểm tra đã thuộc company khác chưa
    if (targetUser.companyId && targetUser.companyId.toString() !== companyId) {
      throw ApiError.conflict('Thành viên này đã thuộc công ty khác')
    }

    // Thêm vào hrMembers và set companyId
    company.hrMembers.push(targetUser._id)
    await company.save()

    targetUser.companyId = company._id
    await targetUser.save()

    // Trả về company đã populate
    const updated = await Company.findById(companyId)
      .populate('hrMembers', 'email profile.fullName profile.avatar')
      .populate('createdBy', 'email profile.fullName')

    return updated
  },

  /**
   * Xóa HR member khỏi company
   * @param {string} companyId
   * @param {string} userId - HR đang thực hiện
   * @param {string} memberId - ID user cần xóa
   * @returns {Object} company đã cập nhật
   */
  removeHrMember: async (companyId, userId, memberId) => {
    const company = await Company.findById(companyId)
    if (!company) {
      throw ApiError.notFound('Không tìm thấy công ty')
    }

    assertHrBelongsToCompany(company, userId)

    // Không cho xóa người tạo company
    if (company.createdBy.toString() === memberId) {
      throw ApiError.badRequest('Không thể xóa người tạo công ty khỏi danh sách thành viên')
    }

    // Kiểm tra member có thuộc company không
    const memberIndex = company.hrMembers.findIndex(
      (id) => id.toString() === memberId
    )
    if (memberIndex === -1) {
      throw ApiError.notFound('Thành viên không thuộc công ty này')
    }

    // Xóa khỏi hrMembers
    company.hrMembers.splice(memberIndex, 1)
    await company.save()

    // Xóa companyId của user
    await User.findByIdAndUpdate(memberId, { $unset: { companyId: 1 } })

    // Trả về company đã populate
    const updated = await Company.findById(companyId)
      .populate('hrMembers', 'email profile.fullName profile.avatar')
      .populate('createdBy', 'email profile.fullName')

    return updated
  },
}

export default companyService
