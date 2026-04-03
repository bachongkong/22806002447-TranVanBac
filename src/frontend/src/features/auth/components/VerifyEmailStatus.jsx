import { useState, useEffect } from 'react'

import toast from 'react-hot-toast'

import { authService } from '@features/auth'

import { Link } from 'react-router-dom'
import './VerifyEmailStatus.css'

export default function VerifyEmailStatus({ token }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  // Gọi API verify khi mount
  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token xác thực không hợp lệ hoặc bị thiếu.')
      return
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('success')
        setMessage('Email của bạn đã được xác thực thành công!')
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.')
      }
    }

    verifyToken()
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
    return (
      <div className="verify-email verify-email--success">
        <span className="verify-email__icon">✅</span>
        <h2>Xác thực thành công!</h2>
        <p className="verify-email__message">{message}</p>
        <Link to="/login" className="verify-email__link">
          Đăng nhập ngay →
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
