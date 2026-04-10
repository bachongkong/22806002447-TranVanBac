import React, { useMemo, useEffect, useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useChatMessages } from '../hooks/useChatQuery'
import useAuthStore from '@app/store/authStore'
import dayjs from 'dayjs'

export default function MessageList({ conversationId }) {
  const user = useAuthStore(state => state.user)
  const virtuosoRef = useRef(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useChatMessages(conversationId)

  // Flatten pages from infinite query
  // Since we load older messages, the order of pages is [newestPage, olderPage, oldestPage]
  // In each page, assuming backend returns messages sorted newest->oldest
  // If backend returns newest->oldest, flattening gives [msg1(new), msg2(old), ...]
  // We need to display chronological order (oldest at top).
  // So we need to reverse the flattened items.
  const messages = useMemo(() => {
    if (!data) return []
    // Giả sử API BE trả về list tin nhắn sort theo createdAt DESC (mới nhất đầu tiên)
    const allMessages = data.pages.flatMap(page => page.data).filter(Boolean)
    // Để hiển thị list từ trên xuống dưới theo thời gian, ta reverse mảng
    return allMessages.reverse()
  }, [data])

  // Load more when scrolled to top
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  // Effect to scroll to bottom on initial load if needed, Virtuoso handles this mostly with initialTopMostItemIndex
  // But followOutput works when new items are added at the end
  useEffect(() => {
    if (!isLoading && virtuosoRef.current) {
        // Optional forced scroll to bottom logic if initialTopMostItemIndex is not enough
    }
  }, [isLoading])

  if (isLoading) {
    return <div style={{ padding: '16px' }}>Loading messages...</div>
  }

  // Use react-virtuoso for reverse scrolling List Virtualization
  // followOutput="smooth" : cuộn mượt xuống cuối khi có tin mới
  // initialTopMostItemIndex: giữ vị trí ở cuối danh sách ngay khi render
  return (
    <div className="message-list-container">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        firstItemIndex={1000000 - messages.length} // Trick for consistent reverse scroll
        initialTopMostItemIndex={messages.length - 1}
        startReached={loadMore}
        followOutput="smooth"
        itemContent={(index, msg) => {
          const isMe = msg.sender?._id === user?.id || msg.sender === user?.id
          return (
            <div className={`message-item ${isMe ? 'me' : 'them'}`}>
              <div className="message-bubble">{msg.content}</div>
              <div className="message-time">{dayjs(msg.createdAt).format('HH:mm')}</div>
            </div>
          )
        }}
        components={{
          Header: () => isFetchingNextPage ? <div style={{textAlign: 'center', padding: '10px', fontSize: '12px'}}>Đang tải tin cũ...</div> : null
        }}
      />
    </div>
  )
}
