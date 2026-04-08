import useNotificationSocket from '@features/notifications/hooks/useNotificationSocket'

/**
 * SocketProvider
 *
 * Component cấp root để mount các hook lắng nghe socket nền (chạy ẩn).
 * Hiện tại mount hook notification. Sau này có thể thêm chat socket.
 * Không bọc Context gì cả, chỉ mount logic.
 */
export default function SocketProvider({ children }) {
  // Lắng nghe kết nối socket cho notifications (auto connect/disconnect theo auth)
  useNotificationSocket()

  // Các socket hooks khác sau này nếu có (e.g. useChatSocket)
  // ...

  return <>{children}</>
}
