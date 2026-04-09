import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import './HomePage.css'

export default function HomePage() {
  useDocumentTitle('SmartHire - Nền tảng tuyển dụng dữ liệu lớn')

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge badge--primary hero-badge">SaaS Tuyển dụng 2026</span>
            <h1 className="hero-title">
              Tuyển dụng Dữ liệu<br />
              <span className="text-primary">Hiệu quả & Chính xác</span>
            </h1>
            <p className="hero-subtitle">
              Giải pháp quản trị vòng đời ứng viên toàn diện. Tự động hóa quy trình sàng lọc và tối ưu hóa việc phân tích dữ liệu tuyển dụng cho doanh nghiệp.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn btn--primary btn--large">Khám phá Việc làm</Link>
              <Link to="/register" className="btn btn--outline btn--large">Tạo tài khoản Doanh nghiệp</Link>
            </div>
          </div>
          
          <div className="hero-stats">
            <div className="stat-card">
              <h2 className="stat-number">12M+</h2>
              <p className="stat-label">Hồ sơ ứng viên</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">45K+</h2>
              <p className="stat-label">Công ty đối tác</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">98%</h2>
              <p className="stat-label">Tỷ lệ hài lòng</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">24h</h2>
              <p className="stat-label">Thời gian tuyển dụng TB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Giải pháp cốt lõi</h2>
            <p>Hệ thống được thiết kế tối giản, tập trung vào dữ liệu và hiệu năng.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h3>Quản lý Đa phân hệ</h3>
              <p>Môi trường làm việc tách biệt và tối ưu cho Candidate, HR và Admin trên cùng một kiến trúc cơ sở dữ liệu duy nhất.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">02</div>
              <h3>Phân tích Dữ liệu</h3>
              <p>Hệ thống báo cáo tự động, trích xuất dữ liệu đa chiều hỗ trợ quyết định chiến lược cho bộ phận nhân sự.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">03</div>
              <h3>Theo dõi Ứng viên ATS</h3>
              <p>Quản lý quy trình Kanban tinh gọn. Kéo thả trạng thái ứng viên nhanh chóng và lưu vết lịch sử tương tác an toàn.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">04</div>
              <h3>Matching Thời gian thực</h3>
              <p>Thuật toán so khớp hồ sơ đa tiêu chí: Kỹ năng, số năm kinh nghiệm và mức lương kỳ vọng hoàn toàn tự động.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section bg-gray">
        <div className="container">
          <div className="workflow-content">
            <h2>Kiến trúc luồng xử lý</h2>
            <p className="workflow-desc">Kiểm soát chặt chẽ từng giai đoạn tuyển dụng</p>
            
            <div className="workflow-steps">
              <div className="workflow-step">
                <h4>Đăng tuyển dụng</h4>
                <p>Khởi tạo Job Listing với dữ liệu chuẩn hóa</p>
              </div>
              <div className="workflow-step">
                <h4>Sàng lọc sơ cấp</h4>
                <p>Bộ lọc hệ thống tự động loại bỏ hồ sơ rác</p>
              </div>
              <div className="workflow-step">
                <h4>Đánh giá chuyên sâu</h4>
                <p>HR phỏng vấn và đánh giá năng lực</p>
              </div>
              <div className="workflow-step">
                <h4>Quyết định</h4>
                <p>Gửi Offer Letter và hoàn thành Onboarding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <h2>Bắt đầu tối ưu hóa quy trình ngay hôm nay</h2>
          <p>Tham gia mạng lưới hơn 45.000 doanh nghiệp đang sử dụng nền tảng của chúng tôi.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn--primary btn--large">Tham gia ngay</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
