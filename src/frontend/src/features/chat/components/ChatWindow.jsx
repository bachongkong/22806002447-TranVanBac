import React, { useState } from 'react'
import { IoMdSend, IoMdArrowBack, IoMdClose } from 'react-icons/io'
import useChatStore from '@app/store/chatStore'
import ConversationList from './ConversationList'
import MessageList from './MessageList'
import { useSendMessage } from '../hooks/useChatQuery'

function MessageInput({ conversationId }) {
  const [text, setText] = useState('')
  const { mutate: sendMessage } = useSendMessage(conversationId)

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    sendMessage(text)
    setText('')
  }

  return (
    <form className="message-input-area" onSubmit={handleSend}>
      <input 
        type="text" 
        placeholder="Nhập tin nhắn..." 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit"><IoMdSend /></button>
    </form>
  )
}

export default function ChatWindow() {
  const { isOpen, closeChat, activeConversationId, setActiveConversation } = useChatStore()

  if (!isOpen) return null

  const handleBack = () => {
    setActiveConversation(null)
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-actions" style={{ display: 'flex', alignItems: 'center' }}>
          {activeConversationId && (
            <span onClick={handleBack}><IoMdArrowBack /></span>
          )}
          <span style={{ marginLeft: activeConversationId ? '8px' : '0' }}>
            {activeConversationId ? 'Đang chat' : 'Tin nhắn'}
          </span>
        </div>
        <div className="chat-header-actions">
          <span onClick={closeChat}><IoMdClose /></span>
        </div>
      </div>

      <div className="chat-body-container">
        {/* If no active conv, show list. Toggle CSS classes for transition */}
        <div className={`conversation-list ${activeConversationId ? 'hidden' : ''}`} style={activeConversationId ? {transform: 'translateX(-100%)'} : {transform: 'translateX(0)'}}>
            <ConversationList />
        </div>

        {/* If active conv, show messages */}
        <div className={`message-view ${activeConversationId ? 'active' : ''}`} style={activeConversationId ? {transform: 'translateX(0)'} : {transform: 'translateX(100%)'}}>
            {activeConversationId && (
               <>
                 <MessageList conversationId={activeConversationId} />
                 <MessageInput conversationId={activeConversationId} />
               </>
            )}
        </div>
      </div>
    </div>
  )
}
