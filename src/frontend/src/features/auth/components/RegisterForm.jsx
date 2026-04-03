import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import './AuthForm.css'

const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Họ tên tối thiểu 2 ký tự')
    .max(100, 'Họ tên tối đa 100 ký tự'),
  email: z.string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(128, 'Mật khẩu tối đa 128 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số'),
  role: z.enum(['candidate', 'hr'], {
    required_error: 'Vui lòng chọn vai trò',
  })
})

export default function RegisterForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'candidate'
    }
  })

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Tạo tài khoản mới</h2>
      <p className="auth-form__subtitle">Tham gia nền tảng tuyển dụng bằng cách tạo tài khoản.</p>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="fullName">Họ và tên</label>
        <input 
          id="fullName" 
          type="text" 
          className={`auth-form__input ${errors.fullName ? 'auth-form__input--error' : ''}`}
          placeholder="Ví dụ: Nguyễn Văn A"
          {...register('fullName')} 
        />
        {errors.fullName && <span className="auth-form__error">{errors.fullName.message}</span>}
      </div>

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
          placeholder="Mật khẩu của bạn"
          {...register('password')} 
        />
        {errors.password && <span className="auth-form__error">{errors.password.message}</span>}
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label">Bạn là:</label>
        <div className="auth-form__options">
          <label className="auth-form__radio-label">
            <input 
              type="radio" 
              value="candidate" 
              {...register('role')} 
            />
            Ứng viên tìm việc
          </label>
          <label className="auth-form__radio-label">
            <input 
              type="radio" 
              value="hr" 
              {...register('role')} 
            />
            Nhà tuyển dụng
          </label>
        </div>
        {errors.role && <span className="auth-form__error">{errors.role.message}</span>}
      </div>

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
      </button>
    </form>
  )
}
