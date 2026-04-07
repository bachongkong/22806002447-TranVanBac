import { Router } from 'express'
import notificationController from './notification.controller.js'
import { asyncHandler, authenticate, validate } from '../../middleware/index.js'
import { listNotificationsSchema, markReadSchema } from './notification.validation.js'

// ============================================
// Notification Routes — /api/notifications
// ============================================
// Tất cả endpoints đều yêu cầu authenticate (mọi role)
// ============================================

const router = Router()
router.use(authenticate)

// GET    /notifications           — Danh sách notifications (paginated)
router.get('/', validate(listNotificationsSchema), asyncHandler(notificationController.list))

// GET    /notifications/unread-count — Số notification chưa đọc
// Lưu ý: Đặt TRƯỚC /:id/read để Express không match nhầm "unread-count" thành :id
router.get('/unread-count', asyncHandler(notificationController.unreadCount))

// PATCH  /notifications/read-all  — Đánh dấu tất cả đã đọc
// Lưu ý: Đặt TRƯỚC /:id/read để Express không match nhầm "read-all" thành :id
router.patch('/read-all', asyncHandler(notificationController.markAllRead))

// PATCH  /notifications/:id/read  — Đánh dấu 1 notification đã đọc
router.patch('/:id/read', validate(markReadSchema), asyncHandler(notificationController.markRead))

export default router
