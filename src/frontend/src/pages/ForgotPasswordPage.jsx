import { Link } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'

import { ForgotPasswordForm } from '@features/auth'

export default function ForgotPasswordPage() {
  useDocumentTitle('Quên mật khẩu')

  return (
    <div className="page page--auth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ForgotPasswordForm />
      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
        {' · '}
        <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  )
}
