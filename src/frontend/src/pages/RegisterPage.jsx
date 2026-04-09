import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import { RegisterForm, useRegister } from '@features/auth'

export default function RegisterPage() {
  useDocumentTitle('Đăng ký')

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
    <div className="page--auth-container">
      <div className="page--auth-content">
        <RegisterForm onSubmit={handleRegisterSubmit} />
        <div className="auth-footer-links">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
