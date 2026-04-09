import { useRef, useEffect, useCallback, useState } from 'react'
import JobCard from '../JobCard/JobCard'
import './JobVirtualizedList.css'

const ITEM_HEIGHT = 155 // px per job card (including gap)
const OVERSCAN = 5 // extra items rendered above/below viewport

export default function JobVirtualizedList({
  jobs,
  onLoadMore,
  hasMore,
  isLoading,
  isLoadingMore,
}) {
  const containerRef = useRef(null)
  const sentinelRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(600)

  // Measure container height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const available = window.innerHeight - rect.top - 20
        setContainerHeight(Math.max(400, available))
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Scroll handler
  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])

  // Loading state
  if (isLoading) {
    return (
      <div className="job-vlist__status">
        <div className="job-vlist__spinner" />
        <p>Đang tải danh sách việc làm...</p>
      </div>
    )
  }

  // Empty state
  if (!jobs.length) {
    return (
      <div className="job-vlist__empty">
        
        <h3>Không tìm thấy việc làm</h3>
        <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    )
  }

  // Virtual scroll calculations
  const totalHeight = jobs.length * ITEM_HEIGHT
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN)
  const endIndex = Math.min(
    jobs.length,
    Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN
  )
  const visibleJobs = jobs.slice(startIndex, endIndex)
  const offsetY = startIndex * ITEM_HEIGHT

  return (
    <div className="job-vlist">
      <p className="job-vlist__count">
        Tìm thấy <strong>{jobs.length}</strong> vị trí{hasMore ? '+' : ''}
      </p>

      <div
        ref={containerRef}
        className="job-vlist__scroll"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div className="job-vlist__spacer" style={{ height: totalHeight }}>
          <div
            className="job-vlist__items"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="job-vlist__sentinel" />
      </div>

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="job-vlist__loading-more">
          <div className="job-vlist__spinner job-vlist__spinner--sm" />
          <span>Đang tải thêm...</span>
        </div>
      )}
    </div>
  )
}
