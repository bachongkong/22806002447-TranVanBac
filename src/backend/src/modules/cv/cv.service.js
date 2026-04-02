import { ApiError } from '../../common/index.js'
import CV from '../../models/CV.js'
import { CV_SOURCE_TYPES } from '../../common/constants.js'
import fs from 'fs/promises'
import path from 'path'

const cvService = {
  /**
   * Truy xuất danh sách CV của ứng viên
   * @param {string} candidateId
   * @returns {Promise<Array>} Danh sách CV
   */
  listMyCvs: async (candidateId) => {
    return CV.find({ candidateId }).sort({ isDefault: -1, createdAt: -1 })
  },

  /**
   * Đặt CV làm mặc định
   * @param {string} candidateId
   * @param {string} cvId
   */
  setDefaultCv: async (candidateId, cvId) => {
    const cv = await CV.findOne({ _id: cvId, candidateId })
    if (!cv) {
      throw ApiError.notFound('Không tìm thấy CV')
    }

    // Set tất cả CV khác thành false
    await CV.updateMany(
      { candidateId, _id: { $ne: cvId } },
      { $set: { isDefault: false } }
    )

    cv.isDefault = true
    await cv.save()
    return cv
  },

  /**
   * Tạo CV Online (từ dữ liệu JSON truyền lên)
   */
  createOnlineCv: async (candidateId, data) => {
    const existingCount = await CV.countDocuments({ candidateId })

    const cv = await CV.create({
      candidateId,
      title: data.title,
      isDefault: existingCount === 0, // Mặc định nếu là CV đầu tiên
      sourceType: CV_SOURCE_TYPES.BUILDER,
      parsedData: data.parsedData,
    })
    return cv
  },

  /**
   * Cập nhật thông tin CV Online
   */
  updateOnlineCv: async (candidateId, cvId, data) => {
    const cv = await CV.findOne({ _id: cvId, candidateId })
    if (!cv) {
      throw ApiError.notFound('Không tìm thấy CV')
    }

    if (cv.sourceType !== CV_SOURCE_TYPES.BUILDER) {
      throw ApiError.badRequest('Bạn chỉ có thể chỉnh sửa nội dung của CV Online')
    }

    if (data.title) cv.title = data.title
    if (data.parsedData) cv.parsedData = data.parsedData

    await cv.save()
    return cv
  },

  /**
   * Xử lý file CV người dùng upload cứng
   */
  uploadCv: async (candidateId, fileBuffer, originalName, title) => {
    const existingCount = await CV.countDocuments({ candidateId })

    // Tạo thư mục public/uploads/cvs nếu chưa tồn tại
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs')
    await fs.mkdir(uploadDir, { recursive: true })

    // Xóa dấu tiếng việt, kí tự lạ
    const safeName = originalName.replace(/[^a-zA-Z0-9_\-\.]/g, '') || 'cv.pdf'
    const fileName = `cv-${candidateId}-${Date.now()}-${safeName}`
    const filePath = path.join(uploadDir, fileName)

    // Lưu file
    await fs.writeFile(filePath, fileBuffer)

    // Tạo record DB
    const cv = await CV.create({
      candidateId,
      title: title || originalName,
      fileUrl: `/public/uploads/cvs/${fileName}`,
      isDefault: existingCount === 0,
      sourceType: CV_SOURCE_TYPES.UPLOAD,
    })

    return cv
  },

  /**
   * Xoá CV (Xoá data và xoá file nếu có)
   */
  deleteCv: async (candidateId, cvId) => {
    const cv = await CV.findOne({ _id: cvId, candidateId })
    if (!cv) {
      throw ApiError.notFound('Không tìm thấy CV')
    }

    // Nếu CV là file upload tĩnh, xoá file
    if (cv.sourceType === CV_SOURCE_TYPES.UPLOAD && cv.fileUrl) {
      try {
        const basename = cv.fileUrl.split('/').pop()
        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'cvs', basename)
        await fs.unlink(fullPath)
      } catch (err) {
        // Bỏ qua nếu file đã biến mất
      }
    }

    const wasDefault = cv.isDefault
    await CV.deleteOne({ _id: cv._id })

    // Gán cờ default về một CV khác nếu xoá mất cái default
    if (wasDefault) {
      const anotherCv = await CV.findOne({ candidateId })
      if (anotherCv) {
        anotherCv.isDefault = true
        await anotherCv.save()
      }
    }
  }
}

export default cvService
