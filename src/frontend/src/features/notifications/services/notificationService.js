import { apiClient, API } from '@shared/services'

const notificationService = {
  getAll: (params) => apiClient.get(API.NOTIFICATIONS.BASE, { params }),
  markRead: (id) => apiClient.patch(API.NOTIFICATIONS.MARK_READ(id)),
  markAllRead: () => apiClient.patch(API.NOTIFICATIONS.MARK_ALL_READ),
  getUnreadCount: () => apiClient.get(API.NOTIFICATIONS.UNREAD_COUNT),
}

export default notificationService
