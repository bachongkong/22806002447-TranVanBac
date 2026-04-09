import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import { RegisterForm, useRegister } from '@features/auth'
import { AuthLayout } from '@shared/components/layout/AuthLayout'

export default function RegisterPage() {
  useDocumentTitle('Đăng ký - Recruitment Platform')

  const { mutateAsync: registerAsync } = useRegister()

  const handleRegisterSubmit = async (data) => {
    try {
      await registerAsync(data)
    } catch (error) {
      // Error is already handled by toast in the hook
      console.error('Register failed:', error)
    }
  }

  return (
    <AuthLayout heading="Tạo tài khoản mới" subheading="Bắt đầu hành trình phát triển sự nghiệp của bạn ngay hôm nay.">
      <RegisterForm onSubmit={handleRegisterSubmit} />
    </AuthLayout>
  )
}

