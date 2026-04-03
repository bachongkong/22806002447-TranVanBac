import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyProfileSchema } from '../schemas/company.schema'
import { useCreateCompany, useUpdateCompany } from '../hooks/useCompany'
import './CompanyProfileForm.css'

export default function CompanyProfileForm({ company }) {
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      industry: '',
      companySize: '',
      location: '',
      socialLinks: {
        linkedin: '',
        facebook: '',
      },
    },
  })

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        location: company.location || '',
        socialLinks: {
          linkedin: company.socialLinks?.linkedin || '',
          facebook: company.socialLinks?.facebook || '',
        },
      })
    }
  }, [company, reset])

  const onSubmit = (data) => {
    if (company) {
      updateCompany.mutate({ id: company._id, data })
    } else {
      createCompany.mutate(data)
    }
  }

  const isLoading = createCompany.isPending || updateCompany.isPending

  return (
    <div className="company-form-container">
      <h2 className="form-title">Thông tin doanh nghiệp</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="company-form">
        <div className="form-group">
          <label>Tên công ty <span className="required">*</span></label>
          <input 
            type="text" 
            {...register('name')} 
            placeholder="Nhập tên công ty..." 
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ngành nghề</label>
            <input 
              type="text" 
              {...register('industry')} 
              placeholder="VD: IT, Tài chính..." 
            />
            {errors.industry && <span className="error-message">{errors.industry.message}</span>}
          </div>

          <div className="form-group">
            <label>Quy mô</label>
            <select {...register('companySize')}>
              <option value="">Chọn quy mô</option>
              <option value="1-10">1-10 nhân viên</option>
              <option value="11-50">11-50 nhân viên</option>
              <option value="51-200">51-200 nhân viên</option>
              <option value="201-500">201-500 nhân viên</option>
              <option value="501-1000">501-1000 nhân viên</option>
              <option value="1000+">1000+ nhân viên</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input 
            type="text" 
            {...register('location')} 
            placeholder="Địa chỉ trụ sở chính" 
          />
        </div>

        <div className="form-group">
          <label>Website</label>
          <input 
            type="text" 
            {...register('website')} 
            placeholder="https://tencuaban.com" 
            className={errors.website ? 'input-error' : ''}
          />
          {errors.website && <span className="error-message">{errors.website.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>LinkedIn (Mạng xã hội)</label>
            <input 
              type="text" 
              {...register('socialLinks.linkedin')} 
              placeholder="https://linkedin.com/company/..." 
              className={errors.socialLinks?.linkedin ? 'input-error' : ''}
            />
            {errors.socialLinks?.linkedin && <span className="error-message">{errors.socialLinks.linkedin.message}</span>}
          </div>

          <div className="form-group">
            <label>Facebook (Mạng xã hội)</label>
            <input 
              type="text" 
              {...register('socialLinks.facebook')} 
              placeholder="https://facebook.com/..." 
              className={errors.socialLinks?.facebook ? 'input-error' : ''}
            />
             {errors.socialLinks?.facebook && <span className="error-message">{errors.socialLinks.facebook.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả công ty</label>
          <textarea 
            {...register('description')} 
            rows="5" 
            placeholder="Giới thiệu về tầm nhìn, sứ mệnh, môi trường làm việc..."
            className={errors.description ? 'input-error' : ''}
          ></textarea>
          {errors.description && <span className="error-message">{errors.description.message}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? 'Đang lưu...' : (company ? 'Lưu thay đổi' : 'Tạo mới hồ sơ')}
          </button>
        </div>
      </form>
    </div>
  )
}
