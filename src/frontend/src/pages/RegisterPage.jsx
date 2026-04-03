import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import { RegisterForm } from '@features/auth'

export default function RegisterPage() {
  useDocumentTitle('Đăng ký')

  const handleRegisterSubmit = (data) => {
    console.log('Register Submit Data:', data)
    // TODO: Connect to backend auth api
  }

  return (
    <div className="page page--auth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <RegisterForm onSubmit={handleRegisterSubmit} />
      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  )
}
