import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import useAuthStore from '@app/store/authStore'
import useNotificationStore from '@app/store/notificationStore'
import notificationService from '../services/notificationService'

/**
 * useNotificationSocket — Kết nối Socket.io namespace /notifications
 *
 * Chạy ẩn nền (không render UI), được mount bởi SocketProvider.
 *
 * Luồng:
 *   1. Khi user authenticated → connect socket với JWT
 *   2. Fetch unreadCount ban đầu qua REST API
 *   3. Lắng nghe events:
 *      - 'notification'           → increment count + toast
 *      - 'notification_read'      → decrement count
 *      - 'all_notifications_read' → reset count = 0
 *   4. Khi logout / unmount → disconnect socket
 */
export default function useNotificationSocket() {
  const socketRef = useRef(null)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { setUnreadCount, increment, decrement, resetCount } =
    useNotificationStore()
  const queryClient = useQueryClient()

  // Fetch unread count ban đầu qua REST
  const fetchInitialCount = useCallback(async () => {
    try {
      const { data } = await notificationService.getUnreadCount()
      setUnreadCount(data.data?.count ?? 0)
    } catch {
      // Bỏ qua lỗi — badge hiện 0
    }
  }, [setUnreadCount])

  useEffect(() => {
    // Guard: chỉ kết nối khi đã authenticated
    if (!isAuthenticated || !accessToken) {
      // Cleanup nếu logout
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        resetCount()
      }
      return
    }

    // Tránh connect lại nếu socket đang active
    if (socketRef.current?.connected) return

    // --- Khởi tạo socket ---
    const socket = io('/notifications', {
      auth: { token: `Bearer ${accessToken}` },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    })

    socketRef.current = socket

    // --- Event handlers ---
    socket.on('connect', () => {
      fetchInitialCount()
    })

    // Nhận notification mới → tăng count + show toast
    socket.on('notification', (payload) => {
      increment()

      // Toast thông báo nhẹ nhàng
      if (payload.title) {
        toast(payload.title, {
          icon: '🔔',
          duration: 4000,
        })
      }

      // Invalidate cache nếu có query notifications đang active
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    })

    // Đánh dấu 1 notification đã đọc (từ tab/device khác)
    socket.on('notification_read', () => {
      decrement()
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    })

    // Đánh dấu tất cả đã đọc (từ tab/device khác)
    socket.on('all_notifications_read', () => {
      resetCount()
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    })

    // Xử lý lỗi kết nối
    socket.on('connect_error', (error) => {
      if (error.message === 'TOKEN_EXPIRED' || error.message === 'TOKEN_INVALID') {
        socket.disconnect()
      }
    })

    // --- Connect ---
    socket.connect()

    // --- Cleanup ---
    return () => {
      socket.off('connect')
      socket.off('notification')
      socket.off('notification_read')
      socket.off('all_notifications_read')
      socket.off('connect_error')
      socket.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated, accessToken, fetchInitialCount, increment, decrement, resetCount, queryClient])
}
