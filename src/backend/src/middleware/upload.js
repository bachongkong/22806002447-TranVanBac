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

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
})

export default upload
