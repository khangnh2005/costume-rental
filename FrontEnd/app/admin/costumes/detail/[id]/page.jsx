'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/costumes/detail.css';

export default function CostumeDetailPage() {
  const [costume, setCostume] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) return;

    const fetchCostume = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/admin/costumes/detail/${id}`);
        if (res.data.success) {
          setCostume(res.data.data);
          setActiveImageIndex(0);
        } else {
          setErrorMessage(res.data.message || 'Không thể tải thông tin trang phục');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchCostume();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>;
  }

  if (errorMessage || !costume) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
        <p>{errorMessage || 'Không tìm thấy dữ liệu'}</p>
        <Link href="/admin/costumes" className="btn-secondary" style={{ display: 'inline-block', marginTop: '12px' }}>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Lấy mảng danh sách ảnh (ưu tiên mảng images, fallback về item.image)
  const imageGallery = Array.isArray(costume.images) && costume.images.length > 0
    ? costume.images
    : costume.image ? [costume.image] : [];

  const currentDisplayImage = imageGallery[activeImageIndex] || imageGallery[0] || '';

  return (
    <div className="costume-detail-card">
      <div className="costume-detail-header">
        Chi tiết trang phục
      </div>

      <div className="costume-detail-body">
        <div className="costume-detail-layout">
          {/* Bộ trưng bày Album ảnh */}
          <div className="costume-gallery-container">
            <div className="main-image-display">
              {currentDisplayImage ? (
                <img src={currentDisplayImage} alt={costume.title} />
              ) : (
                <div className="gallery-no-image">Không có hình ảnh</div>
              )}
            </div>

            {/* Dải ảnh nhỏ bên dưới để chọn */}
            {imageGallery.length > 1 && (
              <div className="thumbnail-scroll-strip">
                {imageGallery.map((url, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail-item ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={url} alt={`Thumbnail ${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chi tiết thông tin sản phẩm */}
          <div className="costume-detail-info">
            <div className="detail-row">
              <div className="detail-label">Tên trang phục:</div>
              <div className="detail-value">
                <strong style={{ fontSize: '16px' }}>{costume.title}</strong>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Danh mục:</div>
              <div className="detail-value">
                <span className="category-tag">{costume.categoryName || 'Chưa phân loại'}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Màu sắc:</div>
              <div className="detail-value">{costume.color || '—'}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Giá thuê / ngày:</div>
              <div className="detail-value">
                <span className="price-tag">
                  {costume.dailyRentalPrice ? `${costume.dailyRentalPrice.toLocaleString('vi-VN')} đ` : '0 đ'}
                </span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Tổng tồn kho:</div>
              <div className="detail-value">
                <strong>{costume.quantity ?? 0}</strong> bộ
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Tồn kho theo Size:</div>
              <div className="detail-value">
                <div className="size-pills-wrap">
                  {costume.sizes && costume.sizes.length > 0 ? (
                    costume.sizes.map((s, idx) => (
                      <span key={idx} className="size-pill">
                        <strong>{s.title}</strong>: {s.quantity}
                      </span>
                    ))
                  ) : (
                    'Chưa thiết lập size'
                  )}
                </div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Mô tả chi tiết:</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                {costume.description || 'Chưa có mô tả'}
              </div>
            </div>
          </div>
        </div>

        <div className="costume-detail-actions">
          <Link href="/admin/costumes" className="btn-secondary">
            Quay lại
          </Link>
          <Link
            href={`/admin/costumes/edit/${costume._id}`}
            className="btn-primary"
            style={{ backgroundColor: '#ffc107', color: '#000' }}
          >
            Chỉnh sửa
          </Link>
        </div>
      </div>
    </div>
  );
}