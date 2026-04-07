/**
 * Namespace /notifications — Notification Room cá nhân
 *
 * Luồng hoạt động:
 *   1. Client kết nối /notifications với JWT access token
 *   2. socketAuth middleware verify token → gắn socket.user
 *   3. Server tự động join socket vào room 'user:{userId}'
 *   4. Backend (controller/service) emit notification tới room cá nhân
 *   5. Client lắng nghe event 'notification' để hiển thị realtime
 *
 * Mọi role (Candidate, HR, Admin) đều được kết nối namespace này.
 *
 * Cách emit notification từ backend controller:
 *   const notifNsp = req.app.get('notificationNamespace')
 *   notifNsp.to(`user:${targetUserId}`).emit('notification', payload)
 */
const setupNotificationNamespace = (notifNsp) => {
  notifNsp.on('connection', (socket) => {
    const { userId, role } = socket.user

    // Tự động join vào room cá nhân — không cần client emit thêm
    const personalRoom = `user:${userId}`
    socket.join(personalRoom)

    console.log(`[NOTIF] Connected: ${socket.id} | user=${userId} role=${role} | room=${personalRoom}`)

    // --- Đánh dấu đã đọc (tùy chọn realtime) ---
    // Nếu cần, client có thể emit event này để sync trạng thái read
    // nhưng việc persist vẫn qua REST API PATCH /notifications/:id/read
    socket.on('mark_read', (notificationId) => {
      if (!notificationId) return
      // Broadcast cho các tab/device khác của cùng user biết
      socket.to(personalRoom).emit('notification_read', { notificationId })
    })

    // --- Đánh dấu tất cả đã đọc ---
    socket.on('mark_all_read', () => {
      socket.to(personalRoom).emit('all_notifications_read')
    })

    // --- Disconnect ---
    socket.on('disconnect', (reason) => {
      console.log(`[NOTIF] Disconnected: ${socket.id} | reason=${reason}`)
    })
  })
}

export default setupNotificationNamespace
