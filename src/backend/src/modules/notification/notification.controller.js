import Notification from '../../models/Notification.js'
import { ApiResponse, ApiError } from '../../common/index.js'

// ============================================
// Notification Controller
// ============================================

const notificationController = {
  /**
   * GET /notifications — Danh sách notifications của user hiện tại
   * Hỗ trợ: pagination (page, limit), filter theo isRead
   */
  list: async (req, res) => {
    const { page, limit, isRead } = req.query
    const userId = req.user.userId
    const skip = (page - 1) * limit

    // Build query filter
    const filter = { userId }
    if (isRead !== undefined) {
      filter.isRead = isRead
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments(filter),
    ])

    ApiResponse.paginated(res, { data: notifications, page, limit, total })
  },

  /**
   * PATCH /notifications/:id/read — Đánh dấu 1 notification đã đọc
   */
  markRead: async (req, res) => {
    const { id } = req.params
    const userId = req.user.userId

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { returnDocument: 'after' },
    )

    if (!notification) {
      throw ApiError.notFound('Không tìm thấy thông báo')
    }

    // Emit realtime cho các tab/device khác của cùng user
    const notifNsp = req.app.get('notificationNamespace')
    if (notifNsp) {
      notifNsp.to(`user:${userId}`).emit('notification_read', {
        notificationId: id,
      })
    }

    ApiResponse.success(res, {
      message: 'Đã đánh dấu đọc',
      data: notification,
    })
  },

  /**
   * PATCH /notifications/read-all — Đánh dấu tất cả đã đọc
   */
  markAllRead: async (req, res) => {
    const userId = req.user.userId

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true },
    )

    // Emit realtime cho các tab/device khác
    const notifNsp = req.app.get('notificationNamespace')
    if (notifNsp) {
      notifNsp.to(`user:${userId}`).emit('all_notifications_read')
    }

    ApiResponse.success(res, {
      message: 'Đã đánh dấu tất cả đã đọc',
      data: { modifiedCount: result.modifiedCount },
    })
  },

  /**
   * GET /notifications/unread-count — Đếm số notification chưa đọc
   */
  unreadCount: async (req, res) => {
    const userId = req.user.userId

    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    })

    ApiResponse.success(res, {
      data: { count },
    })
  },
}

export default notificationController
