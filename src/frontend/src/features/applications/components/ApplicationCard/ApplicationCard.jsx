import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiFileText, FiClock, FiMail, FiCalendar } from 'react-icons/fi'
import { timeAgo } from '@shared/utils'
import { APPLICATION_STATUS } from '@shared/constants'
import './ApplicationCard.css'

/**
 * ApplicationCard — Thẻ ứng viên trên Kanban Board
 * Wrapped bằng React.memo để card KHÔNG re-render khi trạng thái card khác thay đổi
 *
 * @param {Object} props
 * @param {Object} props.application - application data
 * @param {boolean} [props.isOverlay] - overlay state during drag
 * @param {Function} [props.onScheduleInterview] - handler to open schedule modal
 */
function ApplicationCard({ application, isOverlay = false, onScheduleInterview }) {
  const candidate = application.candidateId || {}
  const cv = application.cvId || {}
  const fullName = candidate.profile?.fullName || candidate.email || 'Ứng viên'
  const avatar = candidate.profile?.avatar
  const initial = fullName.charAt(0).toUpperCase()

  // Cho phép lên lịch PV khi status là shortlisted hoặc reviewing
  const canSchedule = [
    APPLICATION_STATUS.SHORTLISTED,
    APPLICATION_STATUS.REVIEWING,
  ].includes(application.status)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application._id,
    data: { application },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`app-card ${isDragging ? 'app-card--dragging' : ''} ${isOverlay ? 'app-card--overlay' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Header: Avatar + Name */}
      <div className="app-card__header">
        <div className="app-card__avatar">
          {avatar ? (
            <img src={avatar} alt={fullName} />
          ) : (
            <span className="app-card__avatar-placeholder">{initial}</span>
          )}
        </div>
        <div className="app-card__info">
          <h4 className="app-card__name">{fullName}</h4>
          {candidate.email && (
            <p className="app-card__email">
              <FiMail /> {candidate.email}
            </p>
          )}
        </div>
      </div>

      {/* CV Info */}
      {cv.title && (
        <div className="app-card__cv">
          <FiFileText />
          <span>{cv.title}</span>
        </div>
      )}

      {/* Footer: Time + Schedule btn */}
      <div className="app-card__footer">
        {canSchedule && onScheduleInterview && (
          <button
            className="app-card__schedule-btn"
            onClick={(e) => {
              e.stopPropagation()
              onScheduleInterview(application)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            title="Lên lịch phỏng vấn"
            type="button"
          >
            <FiCalendar />
            <span>Lên lịch PV</span>
          </button>
        )}
        <span className="app-card__time">
          <FiClock /> {timeAgo(application.appliedAt)}
        </span>
      </div>
    </div>
  )
}

export default memo(ApplicationCard)
