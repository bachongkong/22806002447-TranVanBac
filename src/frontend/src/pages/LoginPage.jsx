import { useDocumentTitle } from '@shared/hooks'

export default function LoginPage() {
  useDocumentTitle('Đăng nhập')

  return (
    <div className="page page--auth">
      <h1>🔐 Đăng nhập</h1>
      <p>Login form — sẽ implement ở Sprint 1</p>
    </div>
  )
}
