import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

/**
 * Format date: "31/03/2026"
 */
export function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY')
}

/**
 * Format datetime: "31/03/2026 10:30"
 */
export function formatDateTime(date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

/**
 * Relative time: "2 giờ trước"
 */
export function timeAgo(date) {
  return dayjs(date).fromNow()
}

/**
 * Format salary range: "15 - 25 triệu"
 */
export function formatSalary(min, max) {
  if (!min && !max) return 'Thỏa thuận'
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`
  if (min) return `Từ ${min.toLocaleString()} VNĐ`
  return `Đến ${max.toLocaleString()} VNĐ`
}

/**
 * Truncate text
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Build query string from object
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  return searchParams.toString()
}

/**
 * Get status badge color class
 */
export function getStatusColor(status) {
  const colors = {
    // Application
    submitted: 'badge--info',
    reviewing: 'badge--warning',
    shortlisted: 'badge--primary',
    interview_scheduled: 'badge--primary',
    interviewed: 'badge--primary',
    offered: 'badge--success',
    hired: 'badge--success',
    rejected: 'badge--danger',
    withdrawn: 'badge--muted',
    // Job
    draft: 'badge--muted',
    pending: 'badge--warning',
    published: 'badge--success',
    closed: 'badge--danger',
    // Company
    approved: 'badge--success',
    // User
    active: 'badge--success',
    blocked: 'badge--danger',
  }
  return colors[status] || 'badge--default'
}

/**
 * Get status display label (Vietnamese)
 */
export function getStatusLabel(status) {
  const labels = {
    submitted: 'Đã nộp',
    reviewing: 'Đang xem xét',
    shortlisted: 'Lọt vào danh sách',
    interview_scheduled: 'Đã lên lịch PV',
    interviewed: 'Đã phỏng vấn',
    offered: 'Đã đề nghị',
    hired: 'Đã tuyển',
    rejected: 'Từ chối',
    withdrawn: 'Đã rút',
    draft: 'Nháp',
    pending: 'Chờ duyệt',
    published: 'Đang tuyển',
    closed: 'Đã đóng',
    approved: 'Đã duyệt',
    active: 'Hoạt động',
    blocked: 'Đã khóa',
  }
  return labels[status] || status
}

function getApiOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiUrl) {
    return window.location.origin
  }

  try {
    return new URL(apiUrl, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

export function resolveAssetUrl(value) {
  if (!value || typeof value !== 'string') return value

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value
  }

  if (value.startsWith('/')) {
    return `${getApiOrigin()}${value}`
  }

  return value
}

export function normalizeUserMedia(user) {
  if (!user) return user

  return {
    ...user,
    profile: user.profile
      ? {
          ...user.profile,
          avatar: resolveAssetUrl(user.profile.avatar),
        }
      : user.profile,
  }
}
