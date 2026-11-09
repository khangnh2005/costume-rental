import '@/app/css/client/register.css';
import RegisterForm from '../components/RegisterForm';

export const metadata = {
  title: 'Đăng Ký Thành Viên | HK OUTFIT Việt Nam',
  description: 'Đăng ký tài khoản khách hàng để nhận ngay ưu đãi giảm 10% khi thuê trang phục biểu diễn và sự kiện tại HK OUTFIT.',
};

export default function RegisterPage() {
  return (
    <div className="register-page-wrapper">
      <div className="register-container">
        {/* Left Side: Member Benefits */}
        <div className="register-benefits-panel">
          <div>
            <div className="benefits-header">
              <h2>Đặc Quyền Hội Viên HK OUTFIT</h2>
              <p>
                Trở thành thành viên ngay hôm nay để tận hưởng trọn vẹn những ưu đãi và dịch vụ chăm sóc chu đáo nhất.
              </p>
            </div>

            <ul className="benefits-list">
              <li className="benefit-item">
                <div className="benefit-icon-badge">🎁</div>
                <div className="benefit-text">
                  <h4>Voucher Giảm 10% Chào Mừng</h4>
                  <p>Áp dụng ngay cho đơn thuê đầu tiên của mọi loại trang phục trong danh mục.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon-badge">⭐</div>
                <div className="benefit-text">
                  <h4>Tích Điểm Thuê Đồ 5%</h4>
                  <p>Mỗi lần thuê đều được tích điểm quy đổi thành tiền mặt cho các lần thuê kế tiếp.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon-badge">📅</div>
                <div className="benefit-text">
                  <h4>Ưu Tiên Giữ Đồ Mùa Cao Điểm</h4>
                  <p>Hội viên được đặt lịch và giữ mẫu trang phục trước 7 ngày trong các dịp lễ Tết, kỷ yếu.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon-badge">✨</div>
                <div className="benefit-text">
                  <h4>Miễn Phí Mượn Thêm Phụ Kiện</h4>
                  <p>Tặng kèm phụ kiện biểu diễn (quạt, trâm, nón, vấn đội đầu...) theo set đồ.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="benefits-footer-quote">
            💬 <em>&ldquo;Hơn 3.000 khách hàng và đoàn biểu diễn đã tin tưởng lựa chọn dịch vụ của chúng tôi.&rdquo;</em>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <RegisterForm />
      </div>
    </div>
  );
}
