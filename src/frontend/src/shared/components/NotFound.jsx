import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Trang bạn tìm kiếm không tồn tại</p>
      <Link to="/" className="btn btn--primary">Về trang chủ</Link>
    </div>
  )
}
