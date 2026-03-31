import { apiClient, API } from '@shared/services'

const chatService = {
  getConversations: () => apiClient.get(API.CHAT.CONVERSATIONS),
  getMessages: (conversationId, params) =>
    apiClient.get(API.CHAT.MESSAGES(conversationId), { params }),
  sendMessage: (conversationId, data) =>
    apiClient.post(API.CHAT.MESSAGES(conversationId), data),
}

export default chatService
