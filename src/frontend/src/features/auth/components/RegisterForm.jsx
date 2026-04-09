import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@shared/components/ui/Button'
import { Building2, UserCircle2, ArrowRight, ArrowLeft } from 'lucide-react'

const baseSchema = z.object({
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(100, 'Họ tên tối đa 100 ký tự'),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').max(128, 'Mật khẩu tối đa 128 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số'),
  confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
  role: z.enum(['candidate', 'hr'], { required_error: 'Vui lòng chọn vai trò' }),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  roleTitle: z.string().optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  companyLocation: z.string().optional(),
})

const registerSchema = baseSchema.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Mật khẩu nhập lại không khớp', path: ['confirmPassword'] })
  }
  if (data.role === 'hr') {
    if (!data.companyName || data.companyName.trim().length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Tên công ty tối thiểu 2 ký tự', path: ['companyName'] })
    }
    if (!data.phone || data.phone.trim().length < 9) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Số điện thoại không hợp lệ', path: ['phone'] })
    }
    if (!data.roleTitle || data.roleTitle.trim().length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Vui lòng nhập chức vụ', path: ['roleTitle'] })
    }
  }
})

// Define fields by step for validation logic
const fieldsByStep = {
  1: ['role'],
  2: ['fullName', 'email', 'password', 'confirmPassword'],
  3: ['companyName', 'phone', 'roleTitle', 'companyLocation']
}


// Extract InputField to prevent re-mounting and use forwardRef to support react-hook-form
import { forwardRef } from 'react'

const InputField = forwardRef(({ id, label, type="text", placeholder, error, options=null, ...props }, ref) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-[#1C252E] dark:text-white" htmlFor={id}>{label}</label>
    {options ? (
      <select 
        id={id} 
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141A21] border focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all ${error ? 'border-red-500' : 'border-[rgba(145,158,171,0.2)] dark:border-[rgba(145,158,171,0.1)]'} text-[#1C252E] dark:text-white`}
        {...props}
      >
        {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : (
      <input 
        id={id} 
        type={type} 
        placeholder={placeholder}
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141A21] border focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all ${error ? 'border-red-500' : 'border-[rgba(145,158,171,0.2)] dark:border-[rgba(145,158,171,0.1)]'} text-[#1C252E] dark:text-white`}
        {...props} 
      />
    )}
    {error && <span className="text-xs text-red-500 font-medium">{error.message}</span>}
  </div>
));
InputField.displayName = "InputField";

export default function RegisterForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  
  // Track which steps the user attempted to bypass without filling
  const [attemptedSteps, setAttemptedSteps] = useState({ 1: false, 2: false, 3: false });

  const { register, handleSubmit, control, formState: { errors, touchedFields, isSubmitted, isSubmitting }, trigger, clearErrors } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      role: 'candidate',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      phone: '',
      roleTitle: '',
      companySize: '',
      industry: '',
      companyLocation: ''
    }
  })

  const selectedRole = useWatch({ control, name: 'role' })
  const TOTAL_STEPS = selectedRole === 'hr' ? 3 : 2;

  const handleNext = async () => {
    setAttemptedSteps(prev => ({ ...prev, [step]: true }));
    const valid = await trigger(fieldsByStep[step]);
    if (valid && step < TOTAL_STEPS) {
      setDirection(1);
      const nextStep = step + 1;
      setStep(nextStep);
    }
  };

  const getFieldError = (fieldName, stepNum) => {
    // Hoàn toàn không dùng isSubmitted để tránh xung đột state giữa các bước / HMR
    if (attemptedSteps[stepNum] || touchedFields[fieldName]) {
      return errors[fieldName];
    }
    return null;
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = (data) => {
    const { confirmPassword: _confirmPassword, ...submitData } = data
    onSubmit(submitData)
  }

  // Bắt lỗi khi Submit form nhưng bị kẹt ở bước hiện tại
  const handleFormError = () => {
    setAttemptedSteps(prev => ({ ...prev, [step]: true }));
  }

  // Removed inline InputField
  // Framer Motion Variants
  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: (direction) => ({ x: direction < 0 ? 30 : -30, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } })
  };

  return (
    <div className="relative backdrop-blur-2xl bg-white/60 dark:bg-[#1C252E]/80 border border-white/50 dark:border-white/10 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_80px_-15px_rgba(0,0,0,0.6)] min-h-[580px] flex flex-col overflow-hidden">
      
      {/* Decorative gradient blob inside card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Header & Progress Indicator */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#1C252E] dark:text-white tracking-tight">Tạo tài khoản mới</h2>
        <div className="flex items-center gap-3 mt-4">
            {[...Array(TOTAL_STEPS)].map((_, idx) => {
              const num = idx + 1;
              return (
                <div key={num} className="flex-1 h-2 bg-[rgba(145,158,171,0.15)] rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: step >= num ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#10b981] rounded-full"
                  />
                </div>
              )
            })}
        </div>
        <p className="mt-3 text-sm text-[#637381] dark:text-[#919EAB] font-medium">Bước {step} trong {TOTAL_STEPS}</p>
      </div>

      <form className="flex-1 flex flex-col" onSubmit={handleSubmit(handleFormSubmit, handleFormError)}>
        {/* Animated Form Steps Container */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait" custom={direction}>
            
            {/* STEP 1: ROLE SELECTION */}
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full flex-1">
                <div className="flex flex-col h-full">
                  <p className="text-[#637381] dark:text-[#919EAB] mb-6">Chào mừng đến với Recruitment Platform. Hãy cho chúng tôi biết bạn là ai để tối ưu trải nghiệm.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
                    {/* Candidate Card */}
                    <label className={`cursor-pointer relative overflow-hidden rounded-2xl border-2 transition-all duration-300 flex flex-col p-6 group ${selectedRole === 'candidate' ? 'border-[#22c55e] bg-[#22c55e]/5 shadow-lg shadow-green-500/10' : 'border-[rgba(145,158,171,0.15)] bg-white dark:bg-[#141A21]/50 hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5'}`}>
                      <input type="radio" value="candidate" className="sr-only" {...register('role')} />
                      
                      {/* Inner glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-[#22c55e]/10 to-transparent opacity-0 transition-opacity duration-300 ${selectedRole === 'candidate' ? 'opacity-100' : 'group-hover:opacity-50'}`} />

                      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${selectedRole === 'candidate' ? 'bg-gradient-to-br from-[#22c55e] to-[#10b981] text-white' : 'bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.1)] text-[#637381] dark:text-[#919EAB] group-hover:text-[#22c55e]'}`}>
                          <UserCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold mb-1 transition-colors ${selectedRole === 'candidate' ? 'text-[#22c55e]' : 'text-[#1C252E] dark:text-white'}`}>Ứng viên</h3>
                          <p className="text-sm text-[#637381] dark:text-[#919EAB]">Tìm việc, tạo CV AI, và kết nối với nhà tuyển dụng hàng đầu.</p>
                        </div>
                      </div>

                      {/* Checkmark indicator */}
                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${selectedRole === 'candidate' ? 'border-[#22c55e] bg-[#22c55e]' : 'border-[rgba(145,158,171,0.3)]'}`}>
                        {selectedRole === 'candidate' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </label>

                    {/* HR Card */}
                     <label className={`cursor-pointer relative overflow-hidden rounded-2xl border-2 transition-all duration-300 flex flex-col p-6 group ${selectedRole === 'hr' ? 'border-[#22c55e] bg-[#22c55e]/5 shadow-lg shadow-green-500/10' : 'border-[rgba(145,158,171,0.15)] bg-white dark:bg-[#141A21]/50 hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5'}`}>
                      <input type="radio" value="hr" className="sr-only" {...register('role')} />
                      
                      <div className={`absolute inset-0 bg-gradient-to-br from-[#22c55e]/10 to-transparent opacity-0 transition-opacity duration-300 ${selectedRole === 'hr' ? 'opacity-100' : 'group-hover:opacity-50'}`} />

                      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${selectedRole === 'hr' ? 'bg-gradient-to-br from-[#22c55e] to-[#10b981] text-white' : 'bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.1)] text-[#637381] dark:text-[#919EAB] group-hover:text-[#22c55e]'}`}>
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold mb-1 transition-colors ${selectedRole === 'hr' ? 'text-[#22c55e]' : 'text-[#1C252E] dark:text-white'}`}>Nhà tuyển dụng</h3>
                          <p className="text-sm text-[#637381] dark:text-[#919EAB]">Đăng tin, quản lý ứng viên bằng pipeline và lên lịch phỏng vấn.</p>
                        </div>
                      </div>

                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${selectedRole === 'hr' ? 'border-[#22c55e] bg-[#22c55e]' : 'border-[rgba(145,158,171,0.3)]'}`}>
                        {selectedRole === 'hr' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </label>
                  </div>
                  {errors.role && attemptedSteps[1] && <span className="text-center mt-4 text-sm text-red-500 font-medium">{errors.role.message}</span>}
                </div>
              </motion.div>
            )}

            {/* STEP 2: ACCOUNT INFO */}
            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full flex-1">
                <div className="flex flex-col h-full space-y-5">
                  <InputField id="fullName" label="Họ và tên" placeholder="Ví dụ: Nguyễn Văn A" error={getFieldError('fullName', 2)} {...register('fullName')} />
                  <InputField id="email" type="email" label="Email" placeholder="email@example.com" error={getFieldError('email', 2)} {...register('email')} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField id="password" type="password" label="Mật khẩu" placeholder="Tối thiểu 8 ký tự" error={getFieldError('password', 2)} {...register('password')} />
                    <InputField id="confirmPassword" type="password" label="Nhập lại mật khẩu" placeholder="Xác nhận mật khẩu" error={getFieldError('confirmPassword', 2)} {...register('confirmPassword')} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: COMPANY INFO (HR ONLY) */}
            {step === 3 && selectedRole === 'hr' && (
              <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col space-y-5 pb-4">
                  <InputField id="companyName" label="Tên công ty *" placeholder="Công ty TNHH Recruitment" error={getFieldError('companyName', 3)} {...register('companyName')} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField id="phone" type="tel" label="Số điện thoại *" placeholder="0901234567" error={getFieldError('phone', 3)} {...register('phone')} />
                    <InputField id="roleTitle" label="Chức vụ *" placeholder="Ví dụ: HR Manager" error={getFieldError('roleTitle', 3)} {...register('roleTitle')} />
                  </div>
                  <InputField id="companyLocation" label="Địa chỉ công ty" placeholder="Quận 1, TP. Hồ Chí Minh" error={getFieldError('companyLocation', 3)} {...register('companyLocation')} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField id="companySize" label="Quy mô" error={getFieldError('companySize', 3)} options={[
                        {value: '', label: 'Chọn quy mô'}, {value: '1-10', label: '1 - 10'}, {value: '11-50', label: '11 - 50'},
                        {value: '51-200', label: '51 - 200'}, {value: '201-500', label: '201 - 500'}, {value: '1000+', label: '1000+'}
                    ]} {...register('companySize')} />
                    <InputField id="industry" label="Ngành nghề" error={getFieldError('industry', 3)} options={[
                        {value: '', label: 'Chọn ngành'}, {value: 'IT', label: 'CNTT'}, {value: 'Finance', label: 'Tài chính'},
                        {value: 'Education', label: 'Giáo dục'}, {value: 'Healthcare', label: 'Y tế'}, {value: 'Other', label: 'Khác'}
                    ]} {...register('industry')} />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[rgba(145,158,171,0.1)] flex items-center justify-between shrink-0">
          <Button 
            type="button" 
            variant="outline" 
            className={`h-12 px-6 font-semibold transition-opacity duration-300 ${step === 1 ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>

          {step < TOTAL_STEPS ? (
            <Button type="button" variant="gradient" className="h-12 px-8 font-bold shadow-lg shadow-green-500/25" onClick={handleNext}>
              Tiếp tục <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" variant="gradient" className="h-12 px-8 font-bold shadow-lg shadow-green-500/25" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Hoàn thành đăng ký'}
            </Button>
          )}
        </div>
      </form>

      {step === 1 && (
        <div className="text-center text-sm mt-6">
          <p className="text-[#637381] dark:text-[#919EAB]">
            Đã có tài khoản? <Link to="/login" className="text-[#22c55e] hover:text-[#10b981] font-bold transition-colors ml-1">Đăng nhập ngay</Link>
          </p>
        </div>
      )}
    </div>
  )
}
