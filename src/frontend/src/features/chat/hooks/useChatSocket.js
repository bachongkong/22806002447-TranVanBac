import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@app/store/authStore'
import useChatStore from '@app/store/chatStore'
import toast from 'react-hot-toast'

/**
 * useChatSocket — Kết nối Socket.io namespace /chat
 * Chạy ẩn nền, được mount bởi SocketProvider.
 */
export default function useChatSocket() {
  const socketRef = useRef(null)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  const incrementUnreadCount = useChatStore((state) => state.incrementUnreadCount)
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const isOpen = useChatStore((state) => state.isOpen)

  useEffect(() => {
    // Guard: chỉ kết nối khi đã authenticated
    if (!isAuthenticated || !accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    if (socketRef.current?.connected) return

    // --- Khởi tạo socket ---
    const socket = io('/chat', {
      auth: { token: `Bearer ${accessToken}` },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      // Connect success
    })

    // Nhận tin nhắn mới
    socket.on('new_message', (payload) => {
      const { conversationId, message, senderId } = payload

      // Nếu không phải tin do chính mình gửi
      if (senderId !== user?.id) {
        // Tăng unread count nếu cửa sổ chat chưa mở HOẶC đang mở nhưng ở hội thoại khác
        if (!isOpen || activeConversationId !== conversationId) {
          incrementUnreadCount()
          toast.success('Bạn có tin nhắn mới', { icon: '💬', duration: 3000 })
        }
      }

      // Xử lý append message vào cache
      // 1. Cập nhật Infinite Query list messsages
      queryClient.setQueryData(['chat-messages', conversationId], (oldData) => {
        if (!oldData) return oldData
        // oldData của infinite query chứa { pages: [...], pageParams: [...] }
        // Cần add msg vào trang đầu tiên
        const newPages = [...oldData.pages]
        if (newPages.length > 0) {
          // Push tin nhắn mới vào mảng messages
          // Vì messages trả về từ BE đang sắp xếp cũ nhất ở cuối hay mới nhất ở đâu đó
          // Ta cứ giả định nó add push hay unshift tuỳ vào API
          // Giả sử API trả mới nhất -> cũ nhất, thì insert lên đầu
          newPages[0] = {
            ...newPages[0],
            data: [message, ...newPages[0].data]
          }
        }
        return { ...oldData, pages: newPages }
      })

      // 2. Cập nhật preview message trong list conversation
      queryClient.setQueryData(['chat-conversations'], (oldData) => {
        if (!oldData) return oldData
        const newData = oldData.map(conv => {
            if (conv._id === conversationId) {
                return { ...conv, lastMessage: message }
            }
            return conv
        })
        // Cần push conversation đó lên đầu tiên
        const targetConvIndex = newData.findIndex(c => c._id === conversationId)
        if (targetConvIndex > 0) {
           const targetConv = newData.splice(targetConvIndex, 1)[0]
           newData.unshift(targetConv)
        }
        return newData;
      })
    })

    // Xử lý lỗi kết nối
    socket.on('connect_error', (error) => {
      if (error.message === 'TOKEN_EXPIRED' || error.message === 'TOKEN_INVALID') {
        socket.disconnect()
      }
    })

    socket.connect()

    return () => {
      socket.off('connect')
      socket.off('new_message')
      socket.off('connect_error')
      socket.disconnect()
      socketRef.current = null
    }
  }, [
    isAuthenticated,
    accessToken,
    incrementUnreadCount,
    queryClient,
    activeConversationId,
    isOpen,
    user
  ])
}
