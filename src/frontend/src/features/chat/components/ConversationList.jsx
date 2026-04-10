import React from 'react'
import { useConversations } from '../hooks/useChatQuery'
import useChatStore from '@app/store/chatStore'
import dayjs from 'dayjs'

export default function ConversationList() {
  const { data: conversations, isLoading } = useConversations()
  const { setActiveConversation } = useChatStore()

  if (isLoading) return <div style={{ padding: '16px' }}>Loading...</div>

  if (!conversations || conversations.length === 0) {
    return <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>Chưa có tin nhắn nào</div>
  }

  return (
    <div className="conversation-list">
      {conversations.map((conv) => {
        // Find other participant (assuming 1 on 1 chat)
        // Need to know who is the 'me' vs 'other'. We'll just show conv name if available
        // Or we assume BE returns `conv.participant` or similar. Let's assume `conv.participantName`
        // as well as `conv.lastMessage`
        const lastMsg = conv.lastMessage?.content || 'Chưa có tin nhắn'
        const time = conv.lastMessage?.createdAt ? dayjs(conv.lastMessage.createdAt).format('HH:mm') : ''
        
        // For actual robust UI, map properties exactly as API provides.
        // Assuming API has conv.name and conv.lastMessage
        return (
          <div 
            key={conv._id} 
            className="conversation-item"
            onClick={() => setActiveConversation(conv._id)}
          >
            <div className="conversation-avatar" />
            <div className="conversation-info">
              <div className="conversation-name">{conv.name || 'Người dùng'}</div>
              <div className="conversation-last-msg">{lastMsg} {time && `• ${time}`}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
