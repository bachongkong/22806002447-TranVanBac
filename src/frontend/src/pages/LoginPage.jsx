import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import { LoginForm, useLogin } from '@features/auth'

export default function LoginPage() {
  useDocumentTitle('Đăng nhập')
  
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
    <div className="page--auth-container">
      <div className="page--auth-content">
        <LoginForm onSubmit={handleLoginSubmit} />
        <div className="auth-footer-links">
          <p>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </p>
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
