import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate, uploadDocument } from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'
import cvController from './cv.controller.js'
import {
  createOnlineCvSchema,
  updateOnlineCvSchema,
  cvIdParamSchema,
} from './cv.validation.js'

const router = Router()

// Bắt buộc đăng nhập để gọi bất kỳ api nào liên quan đến CV
router.use(authenticate)

// Lấy danh sách CV
router.get(
  '/', 
  authorize(ROLES.CANDIDATE), 
  asyncHandler(cvController.listMyCvs)
)

// Upload file CV tĩnh (đặt trước POST '/' để tránh conflict)
router.post(
  '/upload', 
  authorize(ROLES.CANDIDATE), 
  uploadDocument.single('file'), 
  asyncHandler(cvController.uploadCv)
)

// Tạo CV Online (Builder) qua DB
router.post(
  '/', 
  authorize(ROLES.CANDIDATE), 
  validate(createOnlineCvSchema, 'body'),
  asyncHandler(cvController.createOnlineCv)
)

// Cập nhật nội dung CV Online
router.put(
  '/:id', 
  authorize(ROLES.CANDIDATE), 
  validate(cvIdParamSchema, 'params'),
  validate(updateOnlineCvSchema, 'body'),
  asyncHandler(cvController.updateOnlineCv)
)

// Xóa CV
router.delete(
  '/:id', 
  authorize(ROLES.CANDIDATE), 
  validate(cvIdParamSchema, 'params'),
  asyncHandler(cvController.deleteCv)
)

// Set CV mặc định
router.patch(
  '/:id/default', 
  authorize(ROLES.CANDIDATE), 
  validate(cvIdParamSchema, 'params'),
  asyncHandler(cvController.setDefaultCv)
)

// Parse / OCR extracting text
router.post(
  '/:id/parse', 
  authorize(ROLES.CANDIDATE), 
  validate(cvIdParamSchema, 'params'),
  uploadDocument.single('file'), 
  asyncHandler(cvController.parseOcr)
)

export default router
