import Link from 'next/link';

export default function CategorySection({ categories = [] }) {
  // Biểu tượng tương ứng cho danh mục
  const getCategoryIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('áo dài') || lower.includes('truyền thống')) return '👘';
    if (lower.includes('bà ba')) return '🌾';
    if (lower.includes('hiện đại') || lower.includes('váy')) return '👗';
    if (lower.includes('disco') || lower.includes('nhảy')) return '🕺';
    if (lower.includes('trẻ em')) return '👶';
    return '✨';
  };

  // Làm phẳng hoặc lấy các danh mục chính để hiển thị
  const displayCats = [];
  categories.forEach((cat) => {
    displayCats.push(cat);
    if (cat.children && cat.children.length > 0) {
      cat.children.forEach((c) => displayCats.push(c));
    }
  });

  const featuredCats = displayCats.slice(0, 6);

  return (
    <section className="client-section">
      <div className="client-section-container">
        <div className="client-section-header">
          <span className="client-section-subtitle">Danh Mục Nổi Bật</span>
          <h2 className="client-section-title">Khám Phá Theo Chủ Đề Trang Phục</h2>
          <p className="client-section-desc">
            Từ nét duyên dáng của tà áo dài truyền thống đến sự sôi động của phong cách hiện đại,
            chúng tôi mang đến sự lựa chọn phong phú cho mọi dịp lễ hội, kỷ yếu và biểu diễn.
          </p>
        </div>

        <div className="client-category-grid">
          {featuredCats.map((cat, idx) => (
            <Link
              key={cat._id || idx}
              href={`/${cat.slug || cat._id || ''}`}
              className="client-category-card"
            >
              <div className="client-category-icon-wrapper">
                {getCategoryIcon(cat.name)}
              </div>
              <h3 className="client-category-title">{cat.name}</h3>
              <p className="client-category-desc">
                {cat.description ||
                  `Bộ sưu tập ${cat.name} thiết kế tinh xảo, chất vải cao cấp, phù hợp chụp ảnh và sự kiện.`}
              </p>
              <span className="client-category-link-text">
                Xem trang phục →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
