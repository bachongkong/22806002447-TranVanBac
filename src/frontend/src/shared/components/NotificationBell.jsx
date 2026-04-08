import useNotificationStore from '@app/store/notificationStore'
import { HiOutlineBell } from 'react-icons/hi2'
import './NotificationBell.css'

/**
 * NotificationBell — Cục chuông hiển thị badge unread count
 *
 * Chỉ subscribe vào notificationStore.unreadCount
 * → khi count thay đổi, CHỈ component này re-render (không re-render layout/app).
 *
 * Dùng trong sidebar header của các dashboard layouts.
 */
export default function NotificationBell({ onClick }) {
  const unreadCount = useNotificationStore((state) => state.unreadCount)

  return (
    <button
      className="notification-bell"
      onClick={onClick}
      title="Thông báo"
      aria-label={`Thông báo${unreadCount > 0 ? ` — ${unreadCount} chưa đọc` : ''}`}
    >
      <HiOutlineBell className="notification-bell__icon" />
      {unreadCount > 0 && (
        <span className="notification-bell__badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
