import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useDocumentTitle } from '@shared/hooks'
import useAuthStore from '@app/store/authStore'
import { authService } from '@features/auth'

import './VerifyEmailPendingPage.css'

export default function VerifyEmailPendingPage() {
  useDocumentTitle('Xác thực email')
  const { user, logout } = useAuthStore()
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    if (!user?.email) return
    setIsResending(true)
    try {
      await authService.resendVerification({ email: user.email })
      toast.success('Email xác thực đã được gửi lại!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsResending(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="verify-pending">
      <div className="verify-pending__card">
        <span className="verify-pending__icon">📧</span>
        <h2 className="verify-pending__title">Xác thực email của bạn</h2>
        <p className="verify-pending__desc">
          Chúng tôi đã gửi email xác thực đến{' '}
          <strong>{user?.email || 'email của bạn'}</strong>.
          Vui lòng kiểm tra hộp thư (kể cả thư mục spam) và nhấn vào link xác thực.
        </p>

        <div className="verify-pending__actions">
          <button
            className="btn btn--primary"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Đang gửi...' : 'Gửi lại email xác thực'}
          </button>
          <button
            className="btn btn--outline"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>

        <p className="verify-pending__note">
          Sau khi xác thực, hãy{' '}
          <Link to="/login">đăng nhập lại</Link> để vào hệ thống.
        </p>
      </div>
    </div>
  )
}
