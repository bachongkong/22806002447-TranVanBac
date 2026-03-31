import { useDocumentTitle } from '@shared/hooks'

export default function RegisterPage() {
  useDocumentTitle('Đăng ký')

  return (
    <div className="page page--auth">
      <h1>📝 Đăng ký</h1>
      <p>Register form — sẽ implement ở Sprint 1</p>
    </div>
  )
}
