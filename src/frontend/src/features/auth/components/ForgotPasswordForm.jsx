import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { authService } from '@features/auth'

import { Link } from 'react-router-dom'
import './AuthForm.css'
import './ForgotPasswordForm.css'

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
})

export default function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  })

  const handleForgotPassword = async (data) => {
    try {
      await authService.forgotPassword(data)
      setSentEmail(data.email)
      setIsSent(true)
      toast.success('Email đã được gửi!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  if (isSent) {
    return (
      <div className="auth-form">
        <div className="forgot-pw__success">
          <span className="forgot-pw__success-icon">✉️</span>
          <h3>Kiểm tra email của bạn</h3>
          <p>
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{' '}
            <span className="forgot-pw__success-email">{sentEmail}</span>
          </p>
          <p className="forgot-pw__success-note">
            Nếu không thấy email, hãy kiểm tra thư mục spam.
          </p>
          <Link to="/login" className="forgot-pw__back-link">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleForgotPassword)}>
      <h2>Quên mật khẩu</h2>
      <p className="auth-form__subtitle">
        Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
      </p>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          type="email"
          className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
          placeholder="email@example.com"
          {...register('email')}
        />
        {errors.email && <span className="auth-form__error">{errors.email.message}</span>}
      </div>

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <Link to="/login" className="forgot-pw__back-link">
          ← Quay lại đăng nhập
        </Link>
      </div>
    </form>
  )
}
