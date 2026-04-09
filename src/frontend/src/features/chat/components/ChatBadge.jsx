import { FaCommentDots } from 'react-icons/fa'

import useChatStore from '@app/store/chatStore'

import './ChatWindow.css'

export default function ChatBadge() {
  const { toggleChat, unreadCount } = useChatStore()

  return (
    <div className="chat-floating-btn" onClick={toggleChat}>
      <FaCommentDots />
      {unreadCount > 0 && (
        <span key={unreadCount} className="chat-badge bouncing">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  )
}
