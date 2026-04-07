import { ApiError } from '../../common/index.js'
import CV from '../../models/CV.js'
import { CV_SOURCE_TYPES } from '../../common/constants.js'
import fs from 'fs/promises'
import path from 'path'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cvService = {
  listMyCvs: async (candidateId) => {
    return CV.find({ candidateId }).sort({ isDefault: -1, createdAt: -1 })
  },

  setDefaultCv: async (candidateId, cvId) => {
    const cv = await CV.findOne({ _id: cvId, candidateId })
    if (!cv) {
      throw ApiError.notFound('Không tìm thấy CV')
    }

    await CV.updateMany(
      { candidateId, _id: { $ne: cvId } },
      { $set: { isDefault: false } }
    )

    cv.isDefault = true
    await cv.save()
    return cv
  },

  createOnlineCv: async (candidateId, data) => {
    const existingCount = await CV.countDocuments({ candidateId })

    const cv = await CV.create({
      candidateId,
      title: data.title,
      isDefault: existingCount === 0,
      sourceType: CV_SOURCE_TYPES.BUILDER,
      parsedData: data.parsedData,
    })
    return cv
  },

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

  uploadCv: async (candidateId, fileBuffer, originalName, title) => {
    const existingCount = await CV.countDocuments({ candidateId })

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs')
    await fs.mkdir(uploadDir, { recursive: true })

    const safeName = originalName.replace(/[^a-zA-Z0-9_\-\.]/g, '') || 'cv.pdf'
    const fileName = `cv-${candidateId}-${Date.now()}-${safeName}`
    const filePath = path.join(uploadDir, fileName)

    await fs.writeFile(filePath, fileBuffer)

    const cv = await CV.create({
      candidateId,
      title: title || originalName,
      fileUrl: `/public/uploads/cvs/${fileName}`,
      isDefault: existingCount === 0,
      sourceType: CV_SOURCE_TYPES.UPLOAD,
    })

    return cv
  },

  deleteCv: async (candidateId, cvId) => {
    const cv = await CV.findOne({ _id: cvId, candidateId })
    if (!cv) {
      throw ApiError.notFound('Không tìm thấy CV')
    }

    if (cv.sourceType === CV_SOURCE_TYPES.UPLOAD && cv.fileUrl) {
      try {
        const basename = cv.fileUrl.split('/').pop()
        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'cvs', basename)
        await fs.unlink(fullPath)
      } catch (err) { }
    }

    const wasDefault = cv.isDefault
    await CV.deleteOne({ _id: cv._id })

    if (wasDefault) {
      const anotherCv = await CV.findOne({ candidateId })
      if (anotherCv) {
        anotherCv.isDefault = true
        await anotherCv.save()
      }
    }
  },

  parseCVText: (fileBuffer, mimeType) => {
    return new Promise((resolve, reject) => {
      if (mimeType !== 'application/pdf') {
        return reject(ApiError.badRequest('Hệ thống hiện tại chỉ hỗ trợ trích xuất văn bản từ file PDF.'))
      }

      const workerPath = path.resolve(__dirname, '../../workers/ocr.worker.js')
      
      const worker = new Worker(workerPath)

      worker.on('message', (message) => {
        if (message.success) resolve(message.text)
        else reject(ApiError.internal(`OCR Parsing failed: ${message.error}`))
        worker.terminate()
      })

      worker.on('error', (err) => {
        reject(ApiError.internal(`OCR Worker encountered an error: ${err.message}`))
        worker.terminate()
      })

      worker.on('exit', (code) => {
        if (code !== 0) reject(ApiError.internal(`Worker stopped with exit code ${code}`))
      })

      worker.postMessage({ buffer: fileBuffer })
    })
  }
}

export default cvService
