import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import { LoginForm, useLogin } from '@features/auth'
import { AuthLayout } from '@shared/components/layout/AuthLayout'

export default function LoginPage() {
  useDocumentTitle('Đăng nhập - Recruitment Platform')
  
  const { mutateAsync: loginAsync } = useLogin()

  const handleLoginSubmit = async (data) => {
    try {
      await loginAsync(data)
    } catch (error) {
      // Error is already handled by toast in the hook
      console.error('Login failed:', error)
    }
  }

  return (
    <AuthLayout heading="Chào mừng trở lại!" subheading="Đăng nhập để quản lý công việc và tài khoản của bạn.">
      <LoginForm onSubmit={handleLoginSubmit} />
    </AuthLayout>
  )
}

