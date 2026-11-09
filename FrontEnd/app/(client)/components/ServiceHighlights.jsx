import Link from 'next/link';

export default function ServiceHighlights() {
  const highlights = [
    {
      icon: '🌿',
      title: '100% Giặt Hấp Thơm Tho',
      desc: 'Mỗi bộ trang phục đều được giặt hấp, khử trùng và ủi phẳng tươm tất trước khi trao đến tay bạn.',
    },
    {
      icon: '👑',
      title: 'Đầy Đủ Phụ Kiện Đi Kèm',
      desc: 'Hỗ trợ vấn đội đầu, quạt lụa, guốc mộc, trâm cài hoặc cà vạt phù hợp với từng set đồ.',
    },
    {
      icon: '💰',
      title: 'Giá Thuê Rõ Ràng & Hợp Lý',
      desc: 'Minh bạch từng ngày thuê, có chiết khấu cực tốt cho học sinh, sinh viên và các đoàn biểu diễn số lượng lớn.',
    },
    {
      icon: '✂️',
      title: 'Hỗ Trợ Bóp Nới Linh Hoạt',
      desc: 'Đội ngũ thợ may hỗ trợ chỉnh form vừa vặn nhẹ nhàng để bạn tự tin xuất hiện đẹp nhất.',
    },
  ];

  return (
    <section className="client-section client-section-alt">
      <div className="client-section-container">
        <div className="client-section-header">
          <span className="client-section-subtitle">Cam Kết Dịch Vụ</span>
          <h2 className="client-section-title">Tại Sao Nên Thuê Đồ Tại HK OUTFIT?</h2>
          <p className="client-section-desc">
            Chúng tôi luôn đặt trải nghiệm và sự hài lòng của khách hàng lên hàng đầu.
          </p>
        </div>

        <div className="client-highlights-grid">
          {highlights.map((item, idx) => (
            <div key={idx} className="client-highlight-card">
              <div className="client-highlight-icon">{item.icon}</div>
              <h3 className="client-highlight-title">{item.title}</h3>
              <p className="client-highlight-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Member Call to Action Banner */}
        <div className="client-cta-section">
          <div className="client-cta-content">
            <h3>Tham Gia Thành Viên Để Nhận Thêm Ưu Đãi!</h3>
            <p>
              Đăng ký tài khoản hoàn toàn miễn phí, tích lũy điểm thưởng sau mỗi lần thuê,
              nhận voucher giảm giá 10% cho lần thuê tiếp theo và ưu tiên giữ đồ dịp lễ Tết.
            </p>
          </div>
          <Link href="/register" className="client-cta-btn">
            Đăng Ký Tài Khoản Ngay →
          </Link>
        </div>
      </div>
    </section>
  );
}
