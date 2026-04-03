import { useSearchParams } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'

import { ResetPasswordForm } from '@features/auth'

export default function ResetPasswordPage() {
  useDocumentTitle('Đặt lại mật khẩu')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="page page--auth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ResetPasswordForm token={token} />
    </div>
  )
}
