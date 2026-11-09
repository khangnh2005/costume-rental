'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CostumeDetailModal({ costume, onClose }) {
  if (!costume) return null;

  const {
    _id,
    slug,
    title = '',
    images = [],
    categoryName = '',
    color = '',
    sizes = [],
    dailyRentalPrice = 0,
    quantity = 0,
    status = 'active',
    description = '',
  } = costume;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0);
  };

  const currentImage = images && images.length > 0 ? images[activeImageIdx] : null;

  return (
    <div className="client-modal-overlay" onClick={onClose}>
      <div
        className="client-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="client-modal-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ✕
        </button>

        {/* Modal Body */}
        <div className="modal-quick-view-body">
          {/* Left Column: Gallery */}
          <div>
            <div className="modal-gallery-main">
              {currentImage ? (
                <img src={currentImage} alt={title} />
              ) : (
                <div className="card-no-image">📷 Chưa có hình ảnh</div>
              )}
            </div>

            {images && images.length > 1 && (
              <div className="modal-gallery-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`modal-thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img src={img} alt={`${title} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="modal-info-col">
            {costume.categorySlug ? (
              <Link
                href={`/${costume.categorySlug}`}
                onClick={onClose}
                style={{
                  fontSize: '13px',
                  color: '#2563eb',
                  fontWeight: '700',
                  marginBottom: '4px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                📁 {categoryName}
              </Link>
            ) : (
              <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700', marginBottom: '4px' }}>
                {categoryName}
              </span>
            )}
            <h2 className="modal-costume-title">{title}</h2>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
              {status === 'active' && quantity > 0 ? (
                <span className="client-badge-stock client-badge-in-stock">
                  ● Đang có sẵn ({quantity} bộ)
                </span>
              ) : (
                <span className="client-badge-stock client-badge-out-stock">
                  ● Hết hàng tạm thời
                </span>
              )}
              {color && (
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  Màu: <strong>{color}</strong>
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="modal-price-row">
              <span style={{ fontSize: '13px', color: '#64748b' }}>Giá thuê ngày:</span>
              <span className="modal-price-val">{formatPrice(dailyRentalPrice)} đ</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>/ bộ / 24h</span>
            </div>

            {/* Description */}
            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
              {description ? (
                <p>{description}</p>
              ) : (
                <p>
                  Trang phục thiết kế cao cấp, đường may tỉ mỉ, chất liệu thoáng mát và tôn dáng.
                  Đã được giặt hấp thơm tho, sẵn sàng cho bạn diện trong ngày sự kiện.
                </p>
              )}
            </div>

            {/* Sizes Table */}
            {sizes && sizes.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ fontSize: '13px', color: '#1e293b' }}>
                  Kích thước hiện có tại cửa hàng:
                </strong>
                <table className="modal-sizes-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Số lượng còn</th>
                      <th>Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizes.map((s, idx) => (
                      <tr key={idx}>
                        <td><strong>{s.title || s.sizeId}</strong></td>
                        <td>{s.quantity} bộ</td>
                        <td>
                          {s.quantity > 0 ? (
                            <span style={{ color: '#059669', fontWeight: '600' }}>Sẵn sàng</span>
                          ) : (
                            <span style={{ color: '#dc2626' }}>Hết</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <Link
                href={`/costumes/${slug || _id}`}
                className="btn-card-rent"
                style={{ textAlign: 'center', flex: 1, padding: '12px' }}
                onClick={onClose}
              >
                Xem Chi Tiết Đầy Đủ 🔍
              </Link>
              <a
                href="tel:0987654321"
                className="client-btn-login"
                style={{ padding: '12px 18px', textAlign: 'center' }}
              >
                📞 Gọi Giữ Đồ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
