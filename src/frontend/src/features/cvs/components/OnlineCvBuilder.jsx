import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cvSchema } from '../schemas/cv.schema'
import { useCreateOnlineCv } from '../hooks/useCv'
import './OnlineCvBuilder.css'

export default function OnlineCvBuilder() {
  const createOnlineCv = useCreateOnlineCv()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      title: '',
      parsedData: {
        summary: '',
        skills: [],
        education: [],
        experience: [],
        projects: [],
      }
    }
  })

  // Dynamic arrays
  const { fields: eduFields, append: addEdu, remove: removeEdu } = useFieldArray({
    control,
    name: 'parsedData.education'
  })

  const { fields: expFields, append: addExp, remove: removeExp } = useFieldArray({
    control,
    name: 'parsedData.experience'
  })

  const { fields: projFields, append: addProj, remove: removeProj } = useFieldArray({
    control,
    name: 'parsedData.projects'
  })

  const onSubmit = (data) => {
    // Process skills field if it's a comma-separated string from the input
    if (typeof data.parsedData.skills === 'string') {
      data.parsedData.skills = data.parsedData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    }

    createOnlineCv.mutate(data, {
      onSuccess: () => {
        reset() // Reset form sau khi tạo thành công
      }
    })
  }

  return (
    <div className="online-cv-builder fade-in">
      <div className="builder-header">
        <h3>Trình Tạo CV Trực Tuyến</h3>
        <p>Điền các thông tin chuẩn hóa theo format hệ thống để tối ưu cơ hội nghề nghiệp.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- Thông tin chung --- */}
        <div className="form-section">
          <h4>Thông tin chung</h4>
          
          <div className="form-group">
            <label>Tên CV (Bắt buộc) *</label>
            <input 
              {...register('title')} 
              placeholder="VD: CV Frontend Developer 2026" 
            />
            {errors.title && <span className="error-message">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Tóm tắt bản thân (Summary)</label>
            <textarea 
              {...register('parsedData.summary')} 
              rows={3} 
              placeholder="Giới thiệu điểm mạnh, định hướng..."
            />
          </div>

          <div className="form-group">
            <label>Kỹ năng (Cắt nhau bằng dấu phẩy)</label>
            <input 
              {...register('parsedData.skills')} 
              placeholder="VD: React, Node.js, Mông Cổ DB..." 
            />
            <span className="skills-note">Hệ thống sẽ tự bóc tách thành các Keyword Kỹ năng</span>
          </div>
        </div>

        {/* --- Kinh nghiệm làm việc --- */}
        <div className="form-section">
          <h4>Kinh nghiệm làm việc</h4>
          <div className="dynamic-block-container">
            {expFields.map((field, index) => (
               <div key={field.id} className="dynamic-block">
                 <button type="button" className="btn-remove-block" onClick={() => removeExp(index)}>
                   
                 </button>
                 
                 <div className="block-grid-2">
                   <div className="form-group">
                     <label>Công ty *</label>
                     <input {...register(`parsedData.experience.${index}.company`)} />
                     {errors.parsedData?.experience?.[index]?.company && <span className="error-message">{errors.parsedData.experience[index].company.message}</span>}
                   </div>
                   <div className="form-group">
                     <label>Vị trí *</label>
                     <input {...register(`parsedData.experience.${index}.position`)} />
                     {errors.parsedData?.experience?.[index]?.position && <span className="error-message">{errors.parsedData.experience[index].position.message}</span>}
                   </div>
                 </div>

                 <div className="block-grid-2">
                   <div className="form-group">
                     <label>Từ thời gian (Tháng/Năm) *</label>
                     <input type="month" {...register(`parsedData.experience.${index}.from`)} />
                     {errors.parsedData?.experience?.[index]?.from && <span className="error-message">{errors.parsedData.experience[index].from.message}</span>}
                   </div>
                   <div className="form-group">
                     <label>Đến thời gian (Để trống nếu hiện tại)</label>
                     <input type="month" {...register(`parsedData.experience.${index}.to`)} />
                   </div>
                 </div>

                 <div className="form-group" style={{ marginBottom: 0 }}>
                   <label>Mô tả công việc</label>
                   <textarea rows={2} {...register(`parsedData.experience.${index}.description`)}></textarea>
                 </div>
               </div>
            ))}
            
            <button 
              type="button" 
              className="btn-add-block" 
              onClick={() => addExp({ company: '', position: '', from: '', to: '', description: '' })}
            >
               Thêm kinh nghiệm
            </button>
          </div>
        </div>

        {/* --- Học vấn --- */}
        <div className="form-section">
          <h4>Học vấn</h4>
          <div className="dynamic-block-container">
            {eduFields.map((field, index) => (
               <div key={field.id} className="dynamic-block">
                 <button type="button" className="btn-remove-block" onClick={() => removeEdu(index)}>
                   
                 </button>
                 
                 <div className="form-group">
                   <label>Trường / Cơ sở đào tạo *</label>
                   <input {...register(`parsedData.education.${index}.school`)} />
                   {errors.parsedData?.education?.[index]?.school && <span className="error-message">{errors.parsedData.education[index].school.message}</span>}
                 </div>

                 <div className="block-grid-2">
                   <div className="form-group">
                     <label>Ngành / Lĩnh vực *</label>
                     <input {...register(`parsedData.education.${index}.field`)} />
                     {errors.parsedData?.education?.[index]?.field && <span className="error-message">{errors.parsedData.education[index].field.message}</span>}
                   </div>
                   <div className="form-group">
                     <label>Bằng cấp *</label>
                     <input {...register(`parsedData.education.${index}.degree`)} placeholder="Cử nhân, Kỹ sư..." />
                     {errors.parsedData?.education?.[index]?.degree && <span className="error-message">{errors.parsedData.education[index].degree.message}</span>}
                   </div>
                 </div>

                 <div className="block-grid-2">
                   <div className="form-group">
                     <label>Năm bắt đầu *</label>
                     <input type="month" {...register(`parsedData.education.${index}.from`)} />
                     {errors.parsedData?.education?.[index]?.from && <span className="error-message">{errors.parsedData.education[index].from.message}</span>}
                   </div>
                   <div className="form-group">
                     <label>Năm kết thúc</label>
                     <input type="month" {...register(`parsedData.education.${index}.to`)} />
                   </div>
                 </div>
               </div>
            ))}
            
            <button 
              type="button" 
              className="btn-add-block" 
              onClick={() => addEdu({ school: '', field: '', degree: '', from: '', to: '' })}
            >
               Thêm học vấn
            </button>
          </div>
        </div>

        {/* --- Dự án --- */}
        <div className="form-section">
          <h4>Dự án cá nhân / Đã tham gia</h4>
          <div className="dynamic-block-container">
            {projFields.map((field, index) => (
               <div key={field.id} className="dynamic-block">
                 <button type="button" className="btn-remove-block" onClick={() => removeProj(index)}>
                   
                 </button>
                 
                 <div className="block-grid-2">
                   <div className="form-group">
                     <label>Tên dự án *</label>
                     <input {...register(`parsedData.projects.${index}.name`)} />
                     {errors.parsedData?.projects?.[index]?.name && <span className="error-message">{errors.parsedData.projects[index].name.message}</span>}
                   </div>
                   <div className="form-group">
                     <label>Link Github/Tài liệu</label>
                     <input {...register(`parsedData.projects.${index}.url`)} placeholder="https://..." />
                   </div>
                 </div>

                 <div className="form-group" style={{ marginBottom: 0 }}>
                   <label>Mô tả (Tech stack, Module chịu trách nhiệm)</label>
                   <textarea rows={2} {...register(`parsedData.projects.${index}.description`)}></textarea>
                 </div>
               </div>
            ))}
            
            <button 
              type="button" 
              className="btn-add-block" 
              onClick={() => addProj({ name: '', description: '', url: '' })}
            >
               Thêm dự án
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={createOnlineCv.isPending}
          >
             {createOnlineCv.isPending ? 'Đang lưu...' : 'Lưu CV Online'}
          </button>
        </div>
      </form>
    </div>
  )
}
