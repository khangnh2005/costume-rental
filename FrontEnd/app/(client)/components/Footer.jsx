'use client';
import Link from 'next/link';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="client-footer">
      <div className="client-footer-top">
        {/* Col 1: Brand Info */}
        <div className="client-footer-col">
          <h4>Về HK OUTFIT</h4>
          <p className="client-footer-desc">
            Chuyên cung cấp và cho thuê trang phục biểu diễn, áo dài truyền thống,
            cổ phục Việt Nam, đồ múa nghệ thuật và dạ hội chất lượng cao. Đảm bảo
            giặt hấp thơm tho, chuẩn size và phụ kiện phong phú.
          </p>
          <div className="client-footer-contact-item">
            <span>📍</span>
            <span>Số 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
          </div>
          <div className="client-footer-contact-item">
            <span>📞</span>
            <span>0987.654.321 (Zalo tư vấn 24/7)</span>
          </div>
          <div className="client-footer-contact-item">
            <span>✉️</span>
            <span>lienhe@hkoutfit.vn</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="client-footer-col">
          <h4>Khám Phá Nhanh</h4>
          <ul className="client-footer-links">
            <li>
              <Link href="/">Trang Chủ</Link>
            </li>
            <li>
              <Link href="/costumes">Bộ Sưu Tập Trang Phục</Link>
            </li>
            <li>
              <Link href="/ao-dai">Áo Dài Truyền Thống</Link>
            </li>
            <li>
              <Link href="/ao-ba-ba">Áo Bà Ba Nam & Nữ</Link>
            </li>
            <li>
              <Link href="/trang-phuc-nhay-disco">Trang Phục Nhảy & Dạ Hội</Link>
            </li>
            <li>
              <Link href="/register">Đăng Ký Hội Viên Mới</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Service */}
        <div className="client-footer-col">
          <h4>Hỗ Trợ Khách Hàng</h4>
          <ul className="client-footer-links">
            <li>
              <Link href="/">Hướng dẫn chọn size</Link>
            </li>
            <li>
              <Link href="/">Quy trình giao nhận đồ</Link>
            </li>
            <li>
              <Link href="/">Chính sách đặt cọc & hoàn trả</Link>
            </li>
            <li>
              <Link href="/">Báo giá thuê số lượng lớn</Link>
            </li>
            <li>
              <Link href="/">Câu hỏi thường gặp (FAQ)</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Rental Policy Highlights */}
        <div className="client-footer-col">
          <h4>Chính Sách Thuê Đồ</h4>
          <div className="client-footer-policy-box">
            <strong>📋 Quy định giữ đồ & hoàn cọc:</strong>
            <p style={{ margin: '8px 0 0 0' }}>
              • Đặt cọc linh hoạt bằng CCCD hoặc tiền cọc tương ứng giá trị sản phẩm.
            </p>
            <p style={{ margin: '6px 0 0 0' }}>
              • Thời gian tính thuê: 24h/ngày, hỗ trợ lấy sớm trước giờ sự kiện.
            </p>
            <p style={{ margin: '6px 0 0 0' }}>
              • Miễn phí giặt ủi sau khi trả, khách hàng không cần tự giặt.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="client-footer-bottom">
        <div className="client-footer-bottom-inner">
          <div>
            © {currentYear} HK OUTFIT - Dịch vụ cho thuê trang phục chuyên nghiệp. Bảo lưu mọi quyền.
          </div>
          <div>
            Được phát triển phục vụ đồ án môn học & trải nghiệm khách hàng vãng lai.
          </div>
        </div>
      </div>
    </footer>
  );
}
