export default function RentalSteps() {
  const steps = [
    {
      num: '1',
      icon: '👗',
      title: 'Chọn Mẫu Ưng Ý',
      desc: 'Duyệt danh mục phong phú hoặc tìm kiếm theo chủ đề, màu sắc, kích cỡ bạn mong muốn.',
    },
    {
      num: '2',
      icon: '📏',
      title: 'Tư Vấn & Chọn Size',
      desc: 'Hỗ trợ bảng size chi tiết, thử trực tiếp tại cửa hàng hoặc tư vấn online chuẩn xác.',
    },
    {
      num: '3',
      icon: '🤝',
      title: 'Đặt Cọc & Nhận Đồ',
      desc: 'Thủ tục nhanh gọn, cọc linh hoạt bằng CCCD. Trang phục được ủi phẳng và đóng gói kỹ càng.',
    },
    {
      num: '4',
      icon: '✨',
      title: 'Tỏa Sáng & Trả Đồ',
      desc: 'Tự tin diện trong sự kiện. Khi trả không cần giặt sấy, cửa hàng chịu trách nhiệm vệ sinh.',
    },
  ];

  return (
    <section className="client-section">
      <div className="client-section-container">
        <div className="client-section-header">
          <span className="client-section-subtitle">Quy Trình Tiện Lợi</span>
          <h2 className="client-section-title">Thuê Trang Phục Dễ Dàng Chỉ 4 Bước</h2>
          <p className="client-section-desc">
            Tiết kiệm tối đa thời gian của bạn với quy trình thuê đồ nhanh chóng, rõ ràng và chu đáo.
          </p>
        </div>

        <div className="client-steps-grid">
          {steps.map((st) => (
            <div key={st.num} className="client-step-card">
              <div className="client-step-number">{st.num}</div>
              <div className="client-step-icon">{st.icon}</div>
              <h3 className="client-step-title">{st.title}</h3>
              <p className="client-step-desc">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
