import Notification from '../../models/Notification.js'

// ============================================
// Notification Service
// ============================================
// Tách logic DB ra khỏi controller để:
//   1. Controller chỉ lo nhận req/res → trả response
//   2. Các module khác (application, interview...) có thể gọi
//      notificationService.createAndEmit() để tạo + broadcast notification
//      mà không cần biết chi tiết Mongoose hay Socket
// ============================================

const notificationService = {
  /**
   * Tạo notification trong DB + emit realtime qua Socket.io
   *
   * @param {Object} params
   * @param {string}        params.userId  — Người nhận
   * @param {string}        params.type    — Loại notification (application_received, status_changed, ...)
   * @param {string}        params.title   — Tiêu đề hiển thị
   * @param {string}        [params.message] — Nội dung chi tiết
   * @param {Object}        [params.data]  — Metadata tùy loại
   * @param {import('socket.io').Namespace} [params.notificationNamespace] — Socket namespace để emit
   *
   * @returns {Promise<Object>} notification document đã lưu
   */
  createAndEmit: async ({ userId, type, title, message = '', data = null, notificationNamespace = null }) => {
    // 1. Lưu vào DB
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
    })

    // 2. Emit realtime event tới room cá nhân (nếu có namespace)
    if (notificationNamespace) {
      notificationNamespace.to(`user:${userId}`).emit('notification', {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      })
    }

    return notification
  },
}

export default notificationService
