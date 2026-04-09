import { Link } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'

import { ForgotPasswordForm } from '@features/auth'

export default function ForgotPasswordPage() {
  useDocumentTitle('Quên mật khẩu')

  return (
    <div className="page--auth-container">
      <div className="page--auth-content">
        <ForgotPasswordForm />
        <div className="auth-footer-links">
          <p>
            Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
            {' · '}
            <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
