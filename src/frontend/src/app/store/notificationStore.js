import { create } from 'zustand'

/**
 * Notification Store — quản lý unread count cho bell badge
 *
 * Chỉ lưu client state (unreadCount), KHÔNG lưu danh sách notifications
 * (danh sách dùng TanStack Query khi vào trang Notifications).
 *
 * Được cập nhật bởi:
 *   - useNotificationSocket (socket event → increment/reset)
 *   - REST API getUnreadCount (fetch ban đầu khi connect)
 */
const useNotificationStore = create((set, get) => ({
  // State
  unreadCount: 0,

  // Actions
  setUnreadCount: (count) => set({ unreadCount: count }),
  increment: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrement: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  resetCount: () => set({ unreadCount: 0 }),
}))

export default useNotificationStore
