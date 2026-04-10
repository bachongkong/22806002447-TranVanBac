import multer from 'multer'
import { ApiError } from '../common/index.js'

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(ApiError.badRequest('Not an image! Please upload only images.'), false)
  }
}

const documentFilter = (req, file, cb) => {
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (allowedDocTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(ApiError.badRequest('Invalid file type! Please upload only PDF or Word documents.'), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
})

export const uploadDocument = multer({
  storage: multerStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
})

export default upload
