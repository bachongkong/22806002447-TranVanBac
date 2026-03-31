import { Outlet } from 'react-router-dom'
import './MainLayout.css'

/**
 * MainLayout — Layout cho trang public (Landing, Login, Register)
 */
export default function MainLayout() {
  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="main-header__container">
          <a href="/" className="main-header__logo">
            <span className="logo-icon">💼</span>
            <span className="logo-text">SmartHire</span>
          </a>
          <nav className="main-header__nav">
            <a href="/jobs">Việc làm</a>
            <a href="/login" className="btn btn--outline">Đăng nhập</a>
            <a href="/register" className="btn btn--primary">Đăng ký</a>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="main-footer">
        <p>© 2026 SmartHire. All rights reserved.</p>
      </footer>
    </div>
  )
}
