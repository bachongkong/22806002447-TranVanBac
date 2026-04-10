import { useState, useMemo, useCallback, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

import { useDocumentTitle } from '@shared/hooks'
import { APPLICATION_STATUS } from '@shared/constants'
import {
  useApplicationsByJob,
  useUpdateApplicationStatus,
} from '@features/applications/hooks/useApplications'
import ApplicationCard from '@features/applications/components/ApplicationCard/ApplicationCard'
import './KanbanBoardPage.css'

// 🔥 CODE SPLITTING: ScheduleInterviewModal is lazy loaded
// Only downloads when HR clicks "Lên lịch PV" on a card
const ScheduleInterviewModal = lazy(() =>
  import('@features/interviews/components/ScheduleInterviewModal/ScheduleInterviewModal')
)

// ============================================
// Cấu hình cột Kanban
// ============================================
const KANBAN_COLUMNS = [
  { id: APPLICATION_STATUS.SUBMITTED, label: 'Mới nộp', icon: FiInbox, color: '#6366f1' },
  { id: APPLICATION_STATUS.REVIEWING, label: 'Đang xem', icon: FiEye, color: '#8b5cf6' },
  { id: APPLICATION_STATUS.SHORTLISTED, label: 'Chọn lọc', icon: FiStar, color: '#f59e0b' },
  { id: APPLICATION_STATUS.INTERVIEW_SCHEDULED, label: 'Phỏng vấn', icon: FiCalendar, color: '#06b6d4' },
  { id: APPLICATION_STATUS.INTERVIEWED, label: 'Đã PV', icon: FiTarget, color: '#3b82f6' },
  { id: APPLICATION_STATUS.OFFERED, label: 'Offer', icon: FiCheckCircle, color: '#10b981' },
  { id: APPLICATION_STATUS.HIRED, label: 'Tuyển', icon: FiCheckCircle, color: '#22c55e' },
  { id: APPLICATION_STATUS.REJECTED, label: 'Từ chối', icon: FiXCircle, color: '#ef4444' },
]

// ============================================
// KanbanColumn (Droppable)
// ============================================
function KanbanColumn({ column, applications, onScheduleInterview }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const Icon = column.icon

  const appIds = useMemo(() => applications.map((a) => a._id), [applications])

  return (
    <div
      className={`kanban-column ${isOver ? 'kanban-column--over' : ''}`}
    >
      <div className="kanban-column__header">
        <div className="kanban-column__title">
          <Icon className="kanban-column__icon" style={{ color: column.color }} />
          {column.label}
        </div>
        <span className="kanban-column__count">{applications.length}</span>
      </div>

      <div ref={setNodeRef} className="kanban-column__body">
        <SortableContext items={appIds} strategy={verticalListSortingStrategy}>
          {applications.length === 0 ? (
            <div className="kanban-column__empty">Chưa có ứng viên</div>
          ) : (
            applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onScheduleInterview={onScheduleInterview}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}

// ============================================
// Main Page
// ============================================
export default function KanbanBoardPage() {
  const { jobId } = useParams()
  const { data, isLoading, isError, error } = useApplicationsByJob(jobId)
  const updateStatus = useUpdateApplicationStatus(jobId)

  const [activeApp, setActiveApp] = useState(null)
  // State cho Schedule Interview Modal
  const [scheduleTarget, setScheduleTarget] = useState(null)

  useDocumentTitle(data?.meta?.jobTitle ? `Ứng viên — ${data.meta.jobTitle}` : 'Kanban Board')

  // DnD sensors — pointer với activation distance 5px (tránh nhầm click)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  // Group applications theo status
  const groupedApps = useMemo(() => {
    const apps = data?.data || []
    const grouped = {}
    KANBAN_COLUMNS.forEach((col) => {
      grouped[col.id] = apps.filter((app) => app.status === col.id)
    })
    return grouped
  }, [data?.data])

  // Tìm column chứa application
  const findColumn = useCallback(
    (appId) => {
      for (const col of KANBAN_COLUMNS) {
        if (groupedApps[col.id]?.find((a) => a._id === appId)) {
          return col.id
        }
      }
      return null
    },
    [groupedApps]
  )

  // --- Drag handlers ---
  const handleDragStart = useCallback(
    (event) => {
      const { active } = event
      const app = active.data.current?.application
      setActiveApp(app || null)
    },
    []
  )

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event
      setActiveApp(null)

      if (!over) return

      const activeId = active.id
      const sourceColumn = findColumn(activeId)

      // over.id có thể là column ID hoặc card ID
      let targetColumn = null
      if (KANBAN_COLUMNS.find((c) => c.id === over.id)) {
        targetColumn = over.id
      } else {
        targetColumn = findColumn(over.id)
      }

      if (!targetColumn || sourceColumn === targetColumn) return

      // Thực hiện update status
      updateStatus.mutate({
        applicationId: activeId,
        status: targetColumn,
        note: `HR chuyển trạng thái từ ${sourceColumn} sang ${targetColumn}`,
      })
    },
    [findColumn, updateStatus]
  )

  const handleDragCancel = useCallback(() => {
    setActiveApp(null)
  }, [])

  // --- Schedule Interview handler ---
  const handleScheduleInterview = useCallback((application) => {
    setScheduleTarget(application)
  }, [])

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="kanban-page">
        <div className="kanban-page__loading">
          <div className="kanban-page__spinner" />
          <p style={{ color: 'var(--color-text-muted)' }}>Đang tải danh sách ứng viên...</p>
        </div>
      </div>
    )
  }

  // --- Error ---
  if (isError) {
    return (
      <div className="kanban-page">
        <Link to="/hr/jobs" className="kanban-page__back">
           Quay lại
        </Link>
        <div className="kanban-page__error">
          
          <h2 className="kanban-page__error-title">Không thể tải dữ liệu</h2>
          <p className="kanban-page__error-text">
            {error?.response?.data?.message || 'Đã có lỗi xảy ra'}
          </p>
        </div>
      </div>
    )
  }

  const totalApps = data?.meta?.total || 0

  return (
    <div className="kanban-page">
      {/* Header */}
      <div className="kanban-page__header">
        <div>
          <Link to="/hr/jobs" className="kanban-page__back">
             Quay lại tin tuyển dụng
          </Link>
          <h1 className="kanban-page__title">
            {data?.meta?.jobTitle || 'Kanban Board'}
          </h1>
          <p className="kanban-page__subtitle">
            Quản lý pipeline ứng viên bằng kéo thả
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="kanban-stats">
        <div className="kanban-stat">
          
          Tổng: <span className="kanban-stat__count">{totalApps}</span>
        </div>
        {KANBAN_COLUMNS.map((col) => {
          const count = groupedApps[col.id]?.length || 0
          if (count === 0) return null
          return (
            <div key={col.id} className="kanban-stat">
              <span className="kanban-stat__dot" style={{ background: col.color }} />
              {col.label}: <span className="kanban-stat__count">{count}</span>
            </div>
          )
        })}
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="kanban-board">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              applications={groupedApps[col.id] || []}
              onScheduleInterview={handleScheduleInterview}
            />
          ))}
        </div>

        {/* Drag Overlay — card preview khi kéo */}
        <DragOverlay>
          {activeApp ? (
            <ApplicationCard application={activeApp} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 🔥 Schedule Interview Modal — Lazy loaded */}
      {scheduleTarget && (
        <Suspense fallback={null}>
          <ScheduleInterviewModal
            application={scheduleTarget}
            jobId={jobId}
            onClose={() => setScheduleTarget(null)}
          />
        </Suspense>
      )}
    </div>
  )
}
