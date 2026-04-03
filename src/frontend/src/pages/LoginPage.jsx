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
    <div className="page page--auth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <LoginForm onSubmit={handleLoginSubmit} />
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </p>
      <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  )
}
