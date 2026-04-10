import { useState, useEffect, useRef } from 'react'

import toast from 'react-hot-toast'

import { authService } from '@features/auth'
import useAuthStore from '@app/store/authStore'

import { Link } from 'react-router-dom'
import './VerifyEmailStatus.css'

/**
 * Trả về đường dẫn dashboard tương ứng với role
 */
const getDashboardPath = (role) => {
  switch (role) {
    case 'candidate': return '/candidate/dashboard'
    case 'hr': return '/hr/dashboard'
    case 'admin': return '/admin/dashboard'
    default: return '/'
  }
}

export default function VerifyEmailStatus({ token }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  // Lấy trạng thái auth để cập nhật isEmailVerified sau khi verify thành công
  const { isAuthenticated, user, updateUser } = useAuthStore()

  // Ref chống gọi API 2 lần do React StrictMode double-mount.
  // Lần mount đầu gọi API thành công → token bị xóa khỏi DB,
  // lần mount thứ 2 gọi lại sẽ luôn fail vì token không còn.
  const calledRef = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token xác thực không hợp lệ hoặc bị thiếu.')
      return
    }

    // Chỉ gọi API đúng 1 lần
    if (calledRef.current) return
    calledRef.current = true

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token)

        // Cập nhật Zustand store để ProtectedRoute cho phép vào dashboard
        // (tránh bị redirect lại /verify-email-pending với isEmailVerified cũ = false)
        updateUser({ isEmailVerified: true })

        setStatus('success')
        setMessage('Email của bạn đã được xác thực thành công!')
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.')
      }
    }

    verifyToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleResend = async (e) => {
    e.preventDefault()
    if (!resendEmail.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }

    setIsResending(true)
    try {
      await authService.resendVerification({ email: resendEmail })
      toast.success('Email xác thực đã được gửi lại!')
      setResendEmail('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsResending(false)
    }
  }

  // --- Loading ---
  if (status === 'loading') {
    return (
      <div className="verify-email verify-email--loading">
        <div className="verify-email__spinner" />
        <h2>Đang xác thực email...</h2>
        <p className="verify-email__message">Vui lòng đợi trong giây lát.</p>
      </div>
    )
  }

  // --- Success ---
  if (status === 'success') {
    // Nếu user đang đăng nhập → link thẳng vào dashboard (không cần login lại)
    const successLink = isAuthenticated
      ? getDashboardPath(user?.role)
      : '/login'
    const successLabel = isAuthenticated
      ? 'Vào Dashboard →'
      : 'Đăng nhập ngay →'

    return (
      <div className="verify-email verify-email--success">
        <span className="verify-email__icon">✅</span>
        <h2>Xác thực thành công!</h2>
        <p className="verify-email__message">{message}</p>
        <Link to={successLink} className="verify-email__link">
          {successLabel}
        </Link>
      </div>
    )
  }

  // --- Error ---
  return (
    <div className="verify-email verify-email--error">
      <span className="verify-email__icon">❌</span>
      <h2>Xác thực thất bại</h2>
      <p className="verify-email__message">{message}</p>

      <div className="verify-email__resend">
        <p>Bạn có thể yêu cầu gửi lại email xác thực:</p>
        <form className="verify-email__resend-form" onSubmit={handleResend}>
          <input
            type="email"
            className="verify-email__resend-input"
            placeholder="Nhập email của bạn"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isResending}
          >
            {isResending ? 'Đang gửi...' : 'Gửi lại'}
          </button>
        </form>
      </div>

      <Link to="/login" className="verify-email__link">
        ← Quay lại đăng nhập
      </Link>
    </div>
  )
}
