import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { authService } from '@features/auth'

import { Link } from 'react-router-dom'
import './AuthForm.css'
import './ResetPasswordForm.css'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(128, 'Mật khẩu tối đa 128 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số'),
  confirmPassword: z.string()
    .min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

export default function ResetPasswordForm({ token }) {
  const [result, setResult] = useState(null) // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  })

  // Early return — không có token
  if (!token) {
    return (
      <div className="auth-form">
        <div className="reset-pw__no-token">
          <span className="reset-pw__result-icon">⚠️</span>
          <h2>Link không hợp lệ</h2>
          <p>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
          <Link to="/forgot-password" className="reset-pw__action-link">
            Yêu cầu link mới →
          </Link>
        </div>
      </div>
    )
  }

  const handleResetPassword = async (data) => {
    try {
      await authService.resetPassword({ token, password: data.password })
      setResult('success')
      toast.success('Đặt lại mật khẩu thành công!')
    } catch (error) {
      const msg = error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn'
      setErrorMessage(msg)
      setResult('error')
      toast.error(msg)
    }
  }

  // Trạng thái thành công
  if (result === 'success') {
    return (
      <div className="auth-form">
        <div className="reset-pw__result reset-pw__result--success">
          <span className="reset-pw__result-icon">✅</span>
          <h3>Đặt lại mật khẩu thành công!</h3>
          <p>Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập bằng mật khẩu mới.</p>
          <Link to="/login" className="reset-pw__action-link">
            Đăng nhập ngay →
          </Link>
        </div>
      </div>
    )
  }

  // Trạng thái lỗi
  if (result === 'error') {
    return (
      <div className="auth-form">
        <div className="reset-pw__result reset-pw__result--error">
          <span className="reset-pw__result-icon">❌</span>
          <h3>Không thể đặt lại mật khẩu</h3>
          <p>{errorMessage}</p>
          <Link to="/forgot-password" className="reset-pw__action-link">
            Yêu cầu link mới →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleResetPassword)}>
      <h2>Đặt lại mật khẩu</h2>
      <p className="auth-form__subtitle">
        Nhập mật khẩu mới cho tài khoản của bạn.
      </p>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="reset-password">Mật khẩu mới</label>
        <input
          id="reset-password"
          type="password"
          className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
          placeholder="Nhập mật khẩu mới"
          {...register('password')}
        />
        {errors.password && <span className="auth-form__error">{errors.password.message}</span>}
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="reset-confirm-password">Xác nhận mật khẩu</label>
        <input
          id="reset-confirm-password"
          type="password"
          className={`auth-form__input ${errors.confirmPassword ? 'auth-form__input--error' : ''}`}
          placeholder="Nhập lại mật khẩu mới"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <span className="auth-form__error">{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
      </button>
    </form>
  )
}
