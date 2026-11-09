'use client';
import Link from 'next/link';

export default function CostumeCard({ costume, onQuickView }) {
  if (!costume) return null;

  const {
    _id,
    slug,
    title = 'Trang phục',
    images = [],
    categoryName = 'Trang phục',
    categorySlug = '',
    color = '',
    sizes = [],
    dailyRentalPrice = 0,
    quantity = 0,
    status = 'active',
  } = costume;

  const costumeDetailHref = `/costumes/${slug || _id}`;
  const displayImage = images && images.length > 0 ? images[0] : null;
  const isInStock = status === 'active' && quantity > 0;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0);
  };

  return (
    <div className="costume-client-card">
      {/* Image Box */}
      <div className="card-image-box">
        {/* Top Badges */}
        <div className="card-badge-top-left">
          {categorySlug ? (
            <Link
              href={`/${categorySlug}`}
              className="card-badge-category"
              title={`Xem danh mục ${categoryName}`}
              onClick={(e) => e.stopPropagation()}
            >
              {categoryName}
            </Link>
          ) : (
            <span className="card-badge-category">{categoryName}</span>
          )}
        </div>

        <div className="card-badge-top-right">
          {isInStock ? (
            <span className="client-badge-stock client-badge-in-stock">
              <span className="stock-dot pulse"></span>
              Còn {quantity} bộ
            </span>
          ) : (
            <span className="client-badge-stock client-badge-out-stock">
              <span className="stock-dot out"></span>
              Tạm hết
            </span>
          )}
        </div>

        {/* Costume Image Link */}
        <Link href={costumeDetailHref} className="card-image-link" tabIndex={-1}>
          {displayImage ? (
            <img src={displayImage} alt={title} loading="lazy" />
          ) : (
            <div className="card-no-image">
              <span>📷 Chưa có hình ảnh</span>
            </div>
          )}
          <div className="card-image-gradient-overlay" />
        </Link>

        {/* Hover Quick View Button */}
        <div className="card-quick-view-overlay">
          <button
            type="button"
            className="btn-card-quick-view"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView && onQuickView(costume);
            }}
          >
            <span>👁️</span> Xem nhanh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        <h3 className="card-title">
          <Link href={costumeDetailHref} title={title}>
            {title}
          </Link>
        </h3>

        {/* Color and Meta */}
        <div className="card-meta-row">
          {color ? (
            <span className="card-color-chip" title={`Màu sắc: ${color}`}>
              <span className="color-icon">🎨</span>
              <span className="color-label">Màu:</span>
              <strong className="color-value">{color}</strong>
            </span>
          ) : (
            <span className="card-color-chip default">
              <span>✨</span> Đa dạng màu sắc
            </span>
          )}
        </div>

        {/* Available sizes */}
        <div className="card-sizes-row">
          <span className="card-sizes-label">Size:</span>
          {sizes && sizes.length > 0 ? (
            <div className="card-sizes-list">
              {sizes.map((s, idx) => {
                const sQty = Number(s.quantity) || 0;
                const isAvailable = sQty > 0;
                const sizeName = s.title || s.sizeId;
                return (
                  <span
                    key={idx}
                    className={`card-size-pill ${isAvailable ? 'available' : 'unavailable'}`}
                    title={isAvailable ? `Còn ${sQty} bộ` : 'Hết size này'}
                  >
                    {sizeName}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="card-size-free">Free size</span>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="card-footer-box">
          <div className="card-price-block">
            <span className="card-price-label">Giá thuê chỉ từ</span>
            <div className="card-price-wrapper">
              <span className="card-price-value">{formatPrice(dailyRentalPrice)}</span>
              <span className="card-price-unit">₫/ngày</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-card-rent"
            onClick={() => onQuickView && onQuickView(costume)}
            title="Thuê hoặc xem chi tiết"
          >
            Thuê ngay
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
