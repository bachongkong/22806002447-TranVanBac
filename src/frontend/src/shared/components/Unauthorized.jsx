import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <h1>403</h1>
      <p>Bạn không có quyền truy cập trang này</p>
      <Link to="/" className="btn btn--primary">Về trang chủ</Link>
    </div>
  )
}
