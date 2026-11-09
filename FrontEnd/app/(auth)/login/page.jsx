import '@/app/css/client/register.css';
import LoginForm from '../components/LoginForm';

export const metadata = {
  title: 'Đăng Nhập Tài Khoản | HK OUTFIT Việt Nam',
  description: 'Đăng nhập tài khoản khách hàng tại HK OUTFIT để theo dõi lịch thuê đồ, nhận chiết khấu hội viên và thanh toán tiện lợi.',
};

export default function LoginPage() {
  return (
    <div className="register-page-wrapper login-page-wrapper">
      <div className="register-container login-container">
        {/* Left Side: Member Benefits & Welcome */}
        <div className="register-benefits-panel login-benefits-panel">
          <div>
            <div className="benefits-header">
              <h2>Chào Mừng Trở Lại HK OUTFIT</h2>
              <p>
                Đăng nhập để tiếp tục trải nghiệm dịch vụ cho thuê trang phục biểu diễn & sự kiện đẳng cấp nhất.
              </p>
            </div>

            <ul className="benefits-list">
              <li className="benefit-item">
                <div className="benefit-icon-badge">📦</div>
                <div className="benefit-text">
                  <h4>Quản Lý Lịch Thuê Dễ Dàng</h4>
                  <p>Theo dõi thời gian nhận, thời hạn trả đồ và tiền cọc một cách minh bạch.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon-badge">👑</div>
                <div className="benefit-text">
                  <h4>Ưu Đãi Hội Viên Thân Thiết</h4>
                  <p>Tích lũy điểm thưởng và nhận mã giảm giá lên đến 20% cho mỗi đơn thuê tiếp theo.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon-badge">⚡</div>
                <div className="benefit-text">
                  <h4>Đặt Giữ Trang Phục Nhanh Chóng</h4>
                  <p>Lưu thông tin cá nhân và địa chỉ nhận đồ giúp thao tác đặt thuê chỉ mất 30 giây.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon-badge">🛡️</div>
                <div className="benefit-text">
                  <h4>Bảo Mật Thông Tin 100%</h4>
                  <p>Dữ liệu tài khoản của quý khách được bảo mật an toàn tuyệt đối trên hệ thống.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="benefits-footer-quote">
            💬 <em>&ldquo;HK OUTFIT - Đồng hành cùng hàng ngàn tiết mục sân khấu tỏa sáng rực rỡ!&rdquo;</em>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
