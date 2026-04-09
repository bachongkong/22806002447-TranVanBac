import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@shared/components/ui/Button'

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
    <div className="relative backdrop-blur-xl bg-white/70 dark:bg-[#1C252E]/70 border border-white/50 dark:border-white/10 rounded-3xl p-8 md:p-10 transition-all duration-300 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1C252E] dark:text-white mb-2">Đăng nhập</h2>
        <p className="text-[#637381] dark:text-[#919EAB] text-sm">Chào mừng bạn quay trở lại Recruitment Platform!</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C252E] dark:text-white" htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141A21] border focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500' : 'border-[rgba(145,158,171,0.2)] dark:border-[rgba(145,158,171,0.1)]'} text-[#1C252E] dark:text-white`}
            placeholder="email@example.com"
            {...register('email')} 
          />
          {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C252E] dark:text-white" htmlFor="password">Mật khẩu</label>
          <input 
            id="password" 
            type="password" 
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141A21] border focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all ${errors.password ? 'border-red-500' : 'border-[rgba(145,158,171,0.2)] dark:border-[rgba(145,158,171,0.1)]'} text-[#1C252E] dark:text-white`}
            placeholder="Nhập mật khẩu của bạn"
            {...register('password')} 
          />
          {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password.message}</span>}
        </div>

        <div className="pt-2">
          <Button type="submit" variant="gradient" className="w-full h-12 text-base font-bold" disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-[rgba(145,158,171,0.1)] text-center text-sm space-y-3">
        <p>
          <Link to="/forgot-password" className="text-[#22c55e] hover:text-[#10b981] font-semibold transition-colors">Quên mật khẩu?</Link>
        </p>
        <p className="text-[#637381] dark:text-[#919EAB]">
          Chưa có tài khoản? <Link to="/register" className="text-[#22c55e] hover:text-[#10b981] font-semibold transition-colors ml-1">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}

