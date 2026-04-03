import { Router } from 'express'
import { asyncHandler, authenticate, authorize, upload } from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'
import cvController from './cv.controller.js'

const router = Router()

// Bắt buộc đăng nhập để gọi bất kỳ api nào liên quan đến CV
router.use(authenticate)

// TODO: Lấy danh sách CV
router.get(
  '/', 
  authorize(ROLES.CANDIDATE), 
  asyncHandler(cvController.listMyCvs)
)

// TODO: Tạo CV cơ bản qua DB / Builder
router.post(
  '/', 
  authorize(ROLES.CANDIDATE), 
  asyncHandler(cvController.createCv)
)

// TODO: Cập nhật nội dung CV
router.put(
  '/:id', 
  authorize(ROLES.CANDIDATE), 
  asyncHandler(cvController.updateCv)
)

// TODO: Xóa CV
router.delete(
  '/:id', 
  authorize(ROLES.CANDIDATE), 
  asyncHandler(cvController.deleteCv)
)

// TODO: Set CV mặc định
router.patch(
  '/:id/default', 
  authorize(ROLES.CANDIDATE), 
  asyncHandler(cvController.setDefaultCv)
)

// TODO: Đang dùng tạm để test logic parse, thực tế có thể gộp với postUpload
router.post(
  '/upload', 
  authorize(ROLES.CANDIDATE), 
  upload.single('file'), 
  asyncHandler(cvController.uploadCv)
)

// ✅ Parse / OCR extracting text
router.post(
  '/:id/parse', 
  authorize(ROLES.CANDIDATE), 
  upload.single('file'), 
  asyncHandler(cvController.parseOcr)
)

export default router
