import { useSearchParams } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'

import { ResetPasswordForm } from '@features/auth'

export default function ResetPasswordPage() {
  useDocumentTitle('Đặt lại mật khẩu')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="page--auth-container">
      <div className="page--auth-content">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
