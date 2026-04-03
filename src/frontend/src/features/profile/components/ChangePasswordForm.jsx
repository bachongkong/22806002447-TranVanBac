import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

function ChangePasswordForm({ onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const submitHandler = useCallback(
    (data) => {
      onSubmit({ 
        oldPassword: data.oldPassword, 
        newPassword: data.newPassword 
      }, {
        onSuccess: () => reset()
      })
    },
    [onSubmit, reset]
  )

  return (
    <div className="profile-section">
      <h3 className="section-title">Đổi mật khẩu</h3>
      <form onSubmit={handleSubmit(submitHandler)} className="profile-form">
        <div className="form-group">
          <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
          <input
            id="oldPassword"
            type="password"
            className={`form-input ${errors.oldPassword ? 'error' : ''}`}
            placeholder="Nhập mật khẩu hiện tại"
            {...register('oldPassword')}
          />
          {errors.oldPassword && <span className="error-message">{errors.oldPassword.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            className={`form-input ${errors.newPassword ? 'error' : ''}`}
            placeholder="Ít nhất 6 ký tự"
            {...register('newPassword')}
          />
          {errors.newPassword && <span className="error-message">{errors.newPassword.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
          <input
            id="confirmPassword"
            type="password"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Nhập lại mật khẩu mới"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-warning" 
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(ChangePasswordForm)
