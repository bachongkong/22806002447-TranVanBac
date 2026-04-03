import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import './AuthForm.css'

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z.string()
    .min(1, 'Mật khẩu là bắt buộc')
})

export default function LoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Đăng nhập</h2>
      <p className="auth-form__subtitle">Chào mừng bạn quay trở lại nền tảng tuyển dụng thông minh!</p>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="email">Email</label>
        <input 
          id="email" 
          type="email" 
          className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
          placeholder="email@example.com"
          {...register('email')} 
        />
        {errors.email && <span className="auth-form__error">{errors.email.message}</span>}
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="password">Mật khẩu</label>
        <input 
          id="password" 
          type="password" 
          className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
          placeholder="Nhập mật khẩu của bạn"
          {...register('password')} 
        />
        {errors.password && <span className="auth-form__error">{errors.password.message}</span>}
      </div>

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  )
}
