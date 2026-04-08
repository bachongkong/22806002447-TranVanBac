import React, { useEffect, useState } from 'react'
import { FaCommentDots } from 'react-icons/fa'
import useChatStore from '@app/store/chatStore'
import './ChatWindow.css'

export default function ChatBadge() {
  const { toggleChat, unreadCount } = useChatStore()
  const [bouncing, setBouncing] = useState(false)

  // Trigger bounce animation when unread count increases
  useEffect(() => {
    if (unreadCount > 0) {
      setBouncing(true)
      const timer = setTimeout(() => setBouncing(false), 400) // matches animation duration
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  return (
    <div className="chat-floating-btn" onClick={toggleChat}>
      <FaCommentDots />
      {unreadCount > 0 && (
        <span className={`chat-badge ${bouncing ? 'bouncing' : ''}`}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  )
}
