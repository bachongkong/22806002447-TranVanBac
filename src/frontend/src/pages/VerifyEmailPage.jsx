import { useSearchParams } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'

import { VerifyEmailStatus } from '@features/auth'

export default function VerifyEmailPage() {
  useDocumentTitle('Xác thực email')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="page page--auth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <VerifyEmailStatus token={token} />
    </div>
  )
}
