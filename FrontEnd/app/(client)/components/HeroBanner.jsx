'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HeroBanner({ totalCostumes = 0 }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/costumes?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push('/costumes');
    }
  };

  return (
    <section className="client-hero-section">
      <div className="client-hero-container">
        {/* Left Column: Headlines & Search */}
        <div className="client-hero-content">
          <div className="client-hero-badge">
            <span>✨</span> Dịch Vụ Cho Thuê Trang Phục Hàng Đầu TP.HCM
          </div>

          <h1 className="client-hero-title">
            Tỏa Sáng Trong Mọi Sự Kiện Với{' '}
            <span className="highlight">Trang Phục Hoàn Hảo</span>
          </h1>

          <p className="client-hero-subtitle">
            Hàng trăm mẫu áo dài truyền thống, cổ phục Việt Nam, đầm dạ hội và trang phục biểu diễn
            nghệ thuật sắc sảo. Được giặt hấp khử khuẩn 100%, chuẩn form dáng và hỗ trợ phụ kiện trọn gói.
          </p>

          {/* Quick Search Widget */}
          <form className="client-hero-search-box" onSubmit={handleSearch}>
            <span style={{ fontSize: '18px', paddingLeft: '8px' }}>🔍</span>
            <input
              type="text"
              className="client-hero-search-input"
              placeholder="Nhập tên trang phục, loại áo hoặc màu sắc bạn cần..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="client-hero-search-btn">
              Tìm Kiếm Ngay
            </button>
          </form>

          {/* CTAs */}
          <div className="client-hero-cta-group">
            <Link href="/costumes" className="client-hero-btn-primary">
              Xem Bộ Sưu Tập 👗
            </Link>
            <Link href="/register" className="client-hero-btn-outline">
              Đăng Ký Hội Viên Nhận Ưu Đãi 🎁
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Stats */}
        <div className="client-hero-card-showcase">
          <div className="client-hero-card-main">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '42px' }}>🎭</span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '8px 0 4px' }}>
                Hơn {totalCostumes > 0 ? totalCostumes : '500'}+ Mẫu Thiết Kế
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                Cập nhật liên tục theo xu hướng biểu diễn mới nhất
              </p>
            </div>

            <div className="client-hero-grid-mini">
              <div className="client-hero-stat-box">
                <div className="client-hero-stat-num">100%</div>
                <div className="client-hero-stat-label">Giặt hấp tiệt trùng</div>
              </div>
              <div className="client-hero-stat-box">
                <div className="client-hero-stat-num">24/7</div>
                <div className="client-hero-stat-label">Hỗ trợ giữ đồ sớm</div>
              </div>
              <div className="client-hero-stat-box">
                <div className="client-hero-stat-num">Đủ Size</div>
                <div className="client-hero-stat-label">Từ S đến 3XL</div>
              </div>
              <div className="client-hero-stat-box">
                <div className="client-hero-stat-num">0 Đ</div>
                <div className="client-hero-stat-label">Phí giặt ủi sau trả</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
