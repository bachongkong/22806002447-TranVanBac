import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const basicInfoSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
})

function BasicInfoForm({ initialData, onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
    },
  })

  const submitHandler = useCallback(
    (data) => {
      onSubmit(data)
    },
    [onSubmit]
  )

  return (
    <div className="profile-section">
      <h3 className="section-title">Thông tin cơ bản</h3>
      <form onSubmit={handleSubmit(submitHandler)} className="profile-form">
        <div className="form-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            id="fullName"
            type="text"
            className={`form-input ${errors.fullName ? 'error' : ''}`}
            placeholder="vd: Nguyễn Văn A"
            {...register('fullName')}
          />
          {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="vd: 0912345678"
            {...register('phone')}
          />
          {errors.phone && <span className="error-message">{errors.phone.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Địa chỉ</label>
          <input
            id="address"
            type="text"
            className={`form-input ${errors.address ? 'error' : ''}`}
            placeholder="vd: Hà Nội, Việt Nam"
            {...register('address')}
          />
          {errors.address && <span className="error-message">{errors.address.message}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn--primary" 
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(BasicInfoForm)
