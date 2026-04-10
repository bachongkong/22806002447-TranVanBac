import { create } from 'zustand'

/**
 * useChatStore — Quản lý trạng thái UI của Chat và Unread Count
 */
const useChatStore = create((set) => ({
  isOpen: false, // Trạng thái mở/đóng cửa sổ chat
  activeConversationId: null, // Bật đoạn hội thoại hiện tại
  unreadCount: 0, // Tổng số tin chưa đọc (có thể tính theo /chat hook)

  // Actions
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false, activeConversationId: null }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnreadCount: () => set({ unreadCount: 0 }),
}))

export default useChatStore
