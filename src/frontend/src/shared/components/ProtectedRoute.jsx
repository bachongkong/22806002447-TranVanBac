import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@app/store/authStore'

/**
 * ProtectedRoute — chặn truy cập nếu chưa login hoặc sai role
 * @param {string[]} allowedRoles - Danh sách role được phép truy cập
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
