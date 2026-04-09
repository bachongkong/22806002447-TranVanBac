import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import './AuthForm.css'

const baseSchema = z.object({
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
  confirmPassword: z.string()
    .min(1, 'Vui lòng nhập lại mật khẩu'),
  role: z.enum(['candidate', 'hr'], {
    required_error: 'Vui lòng chọn vai trò',
  }),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  roleTitle: z.string().optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  companyLocation: z.string().optional(),
})

const registerSchema = baseSchema.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Mật khẩu nhập lại không khớp',
      path: ['confirmPassword'],
    })
  }

  if (data.role === 'hr') {
    if (!data.companyName || data.companyName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tên công ty tối thiểu 2 ký tự',
        path: ['companyName'],
      })
    }

    if (!data.phone || data.phone.trim().length < 9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Số điện thoại không hợp lệ',
        path: ['phone'],
      })
    }

    if (!data.roleTitle || data.roleTitle.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập chức vụ',
        path: ['roleTitle'],
      })
    }
  }
})

export default function RegisterForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'candidate',
    },
  })

  const selectedRole = useWatch({
    control,
    name: 'role',
  })

  const handleFormSubmit = (data) => {
    const { confirmPassword: _confirmPassword, ...submitData } = data
    onSubmit(submitData)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <h2>Tạo tài khoản mới</h2>
      <p className="auth-form__subtitle">
        Tham gia nền tảng tuyển dụng bằng cách tạo tài khoản.
      </p>

      <div className="auth-form__group">
        <label className="auth-form__label">Bạn là:</label>
        <div className="auth-form__options">
          <label className="auth-form__radio-label">
            <input type="radio" value="candidate" {...register('role')} />
            Ứng viên tìm việc
          </label>
          <label className="auth-form__radio-label">
            <input type="radio" value="hr" {...register('role')} />
            Nhà tuyển dụng
          </label>
        </div>
        {errors.role && <span className="auth-form__error">{errors.role.message}</span>}
      </div>

      <div className="auth-form__divider" />

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
        <label className="auth-form__label" htmlFor="confirmPassword">Nhập lại mật khẩu</label>
        <input
          id="confirmPassword"
          type="password"
          className={`auth-form__input ${errors.confirmPassword ? 'auth-form__input--error' : ''}`}
          placeholder="Xác nhận mật khẩu"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <span className="auth-form__error">{errors.confirmPassword.message}</span>}
      </div>

      {selectedRole === 'hr' && (
        <>
          <div className="auth-form__divider" />
          <p className="auth-form__section-title">Thông tin nhà tuyển dụng</p>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="companyName">Tên công ty *</label>
            <input
              id="companyName"
              type="text"
              className={`auth-form__input ${errors.companyName ? 'auth-form__input--error' : ''}`}
              placeholder="Ví dụ: Công ty TNHH ABC"
              {...register('companyName')}
            />
            {errors.companyName && <span className="auth-form__error">{errors.companyName.message}</span>}
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="phone">Số điện thoại *</label>
            <input
              id="phone"
              type="tel"
              className={`auth-form__input ${errors.phone ? 'auth-form__input--error' : ''}`}
              placeholder="Ví dụ: 0901234567"
              {...register('phone')}
            />
            {errors.phone && <span className="auth-form__error">{errors.phone.message}</span>}
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="roleTitle">Chức vụ *</label>
            <input
              id="roleTitle"
              type="text"
              className={`auth-form__input ${errors.roleTitle ? 'auth-form__input--error' : ''}`}
              placeholder="Ví dụ: HR Manager, Trưởng phòng nhân sự"
              {...register('roleTitle')}
            />
            {errors.roleTitle && <span className="auth-form__error">{errors.roleTitle.message}</span>}
          </div>

          <div className="auth-form__row">
            <div className="auth-form__group auth-form__group--half">
              <label className="auth-form__label" htmlFor="companySize">Quy mô</label>
              <select
                id="companySize"
                className={`auth-form__input auth-form__select ${errors.companySize ? 'auth-form__input--error' : ''}`}
                {...register('companySize')}
              >
                <option value="">Chọn quy mô</option>
                <option value="1-10">1 - 10 nhân sự</option>
                <option value="11-50">11 - 50 nhân sự</option>
                <option value="51-200">51 - 200 nhân sự</option>
                <option value="201-500">201 - 500 nhân sự</option>
                <option value="501-1000">501 - 1000 nhân sự</option>
                <option value="1000+">1000+ nhân sự</option>
              </select>
            </div>

            <div className="auth-form__group auth-form__group--half">
              <label className="auth-form__label" htmlFor="industry">Ngành nghề</label>
              <select
                id="industry"
                className={`auth-form__input auth-form__select ${errors.industry ? 'auth-form__input--error' : ''}`}
                {...register('industry')}
              >
                <option value="">Chọn ngành</option>
                <option value="IT">Công nghệ thông tin</option>
                <option value="Finance">Tài chính - Ngân hàng</option>
                <option value="Education">Giáo dục - Đào tạo</option>
                <option value="Healthcare">Y tế - Sức khỏe</option>
                <option value="Manufacturing">Sản xuất</option>
                <option value="Retail">Bán lẻ - Thương mại</option>
                <option value="Marketing">Marketing - Truyền thông</option>
                <option value="Construction">Xây dựng - Bất động sản</option>
                <option value="Logistics">Vận tải - Logistics</option>
                <option value="Other">Ngành khác</option>
              </select>
            </div>
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="companyLocation">Địa chỉ công ty</label>
            <input
              id="companyLocation"
              type="text"
              className={`auth-form__input ${errors.companyLocation ? 'auth-form__input--error' : ''}`}
              placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
              {...register('companyLocation')}
            />
          </div>
        </>
      )}

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
      </button>
    </form>
  )
}
