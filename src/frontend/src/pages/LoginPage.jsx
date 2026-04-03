import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import { LoginForm } from '@features/auth'

export default function LoginPage() {
  useDocumentTitle('Đăng nhập')

  const handleLoginSubmit = (data) => {
    console.log('Login Submit Data:', data)
    // TODO: Connect to backend auth api
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
