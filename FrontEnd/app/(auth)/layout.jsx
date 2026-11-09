import Link from 'next/link';
import '@/app/css/client/client.css';
import './auth.css';

export const metadata = {
  title: 'Tài Khoản Khách Hàng | HK OUTFIT Việt Nam',
  description: 'Đăng nhập hoặc đăng ký tài khoản tại HK OUTFIT để nhận ưu đãi thuê trang phục biểu diễn độc quyền.',
};

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout-wrapper">
      {/* Header riêng biệt tối giản của Auth (không dùng header của trang chủ) */}
      <header className="auth-header">
        <div className="auth-header-inner">
          <Link href="/" className="auth-logo-link" title="Về trang chủ HK OUTFIT">
            <div className="auth-logo-badge">HK</div>
            <div className="auth-logo-text">
              <span className="auth-brand-name">Trang Phục Biểu Diễn</span>
              <span className="auth-brand-sub">HK OUTFIT VIỆT NAM</span>
            </div>
          </Link>

          <div className="auth-header-actions">
            <span className="auth-hotline-pill">
              <span className="hotline-dot"></span>
              Hotline hỗ trợ: <strong>095 490 7714</strong>
            </span>
            <Link href="/" className="auth-back-home-btn">
              <span>←</span>
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Vùng nội dung chính chứa form đăng nhập / đăng ký */}
      <main className="auth-main-area">
        <div className="auth-content-box">
          {children}
        </div>
      </main>

      {/* Footer riêng biệt tối giản của Auth (không dùng footer lớn của trang chủ) */}
      <footer className="auth-footer">
        <div className="auth-footer-inner">
          <p className="auth-footer-copy">
            © 2026 HK OUTFIT Việt Nam. Hệ thống cho thuê trang phục biểu diễn & sự kiện chuyên nghiệp.
          </p>
          <div className="auth-footer-links">
            <Link href="/">Điều khoản dịch vụ</Link>
            <span className="auth-footer-sep">•</span>
            <Link href="/">Chính sách bảo mật</Link>
            <span className="auth-footer-sep">•</span>
            <Link href="/">Quy định thuê đồ</Link>
            <span className="auth-footer-sep">•</span>
            <Link href="/">Liên hệ hỗ trợ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
