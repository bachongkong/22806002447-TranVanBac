import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const hrInfoSchema = z.object({
  roleTitle: z.string().optional().or(z.literal('')),
})

function HrInfoForm({ initialData, onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(hrInfoSchema),
    defaultValues: {
      roleTitle: initialData?.roleTitle || '',
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
      <h3 className="section-title">Thong tin nghe nghiep</h3>
      <form onSubmit={handleSubmit(submitHandler)} className="profile-form">
        <div className="form-group">
          <label htmlFor="roleTitle">Chuc danh / vai tro</label>
          <input
            id="roleTitle"
            type="text"
            className={`form-input ${errors.roleTitle ? 'error' : ''}`}
            placeholder="vd: HR Manager"
            {...register('roleTitle')}
          />
          {errors.roleTitle && <span className="error-message">{errors.roleTitle.message}</span>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Dang luu...' : 'Luu thong tin nghe nghiep'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(HrInfoForm)
