import { useDocumentTitle } from '@shared/hooks'

export default function HomePage() {
  useDocumentTitle('Trang chủ')

  return (
    <div className="page page--home">
      <h1>🏠 Landing Page</h1>
      <p>Smart Recruitment Platform — Coming soon</p>
    </div>
  )
}
