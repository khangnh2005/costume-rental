'use client';
import { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import '@/app/css/client/costumes.css';
import CostumeCard from '../../components/CostumeCard';

function CostumeDetailContent({ params }) {
  // Thao tác an toàn với params trong React 19 / Next 15+
  const resolvedParams = use(params);
  const slugCostume = resolvedParams?.slugCostume || resolvedParams?.id;
  const router = useRouter();

  const [costume, setCostume] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [rentalDays, setRentalDays] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        let res;
        try {
          res = await axios.get(`http://127.0.0.1:5000/client/costumes/detail/${slugCostume}`);
        } catch {
          res = await axios.get(`http://localhost:5000/admin/costumes/detail/${slugCostume}`);
        }

        if (res.data && res.data.data) {
          const item = res.data.data;
          setCostume(item);
          if (res.data.related) {
            setRelated(res.data.related);
          }
          // Chọn size đầu tiên còn hàng làm mặc định
          const availableSize = (item.sizes || []).find((s) => s.quantity > 0);
          if (availableSize) {
            setSelectedSize(availableSize.title || availableSize.sizeId);
          }

          // Tự động chuẩn hóa URL sang slug nếu đang truy cập bằng _id cũ
          if (item.slug && slugCostume !== item.slug) {
            router.replace(`/costumes/${item.slug}`);
          }
        }
      } catch (err) {
        console.error('Lỗi nạp chi tiết trang phục:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slugCostume) {
      fetchDetail();
    }
  }, [slugCostume, router]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0);
  };

  if (loading) {
    return (
      <div className="costumes-page-wrapper" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Đang nạp thông tin trang phục...</p>
      </div>
    );
  }

  if (!costume) {
    return (
      <div className="costumes-page-wrapper" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2>Không Tìm Thấy Trang Phục</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Mẫu trang phục này có thể đã được gỡ bỏ hoặc liên kết không chính xác.
        </p>
        <Link href="/costumes" className="btn-card-rent">
          Quay Lại Danh Sách Trang Phục
        </Link>
      </div>
    );
  }

  const {
    title,
    images = [],
    categoryName,
    color,
    sizes = [],
    dailyRentalPrice = 0,
    quantity = 0,
    status,
    description,
  } = costume;

  const currentImage = images && images.length > 0 ? images[activeImageIdx] : null;
  const isInStock = status === 'active' && quantity > 0;
  const totalPrice = dailyRentalPrice * rentalDays;

  return (
    <div className="costumes-page-wrapper">
      {/* Breadcrumb */}
      <nav className="costumes-breadcrumb">
        <Link href="/">Trang Chủ</Link>
        <span>/</span>
        <Link href="/costumes">Bộ Sưu Tập</Link>
        {costume.categorySlug && (
          <>
            <span>/</span>
            <Link href={`/${costume.categorySlug}`}>{categoryName}</Link>
          </>
        )}
        <span>/</span>
        <span>{title}</span>
      </nav>

      {/* Main Detail Grid */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--client-border)',
          padding: '32px',
          boxShadow: 'var(--client-shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 480px) 1fr',
          gap: '40px',
          marginBottom: '50px',
        }}
      >
        {/* Left Column: Gallery */}
        <div>
          <div
            style={{
              width: '100%',
              height: '460px',
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: '14px',
            }}
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="card-no-image" style={{ height: '100%' }}>
                Chưa có ảnh
              </div>
            )}
          </div>

          {images && images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: activeImageIdx === idx ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    padding: 0,
                    cursor: 'pointer',
                    background: '#f1f5f9',
                    flexShrink: 0,
                  }}
                  onClick={() => setActiveImageIdx(idx)}
                >
                  <img
                    src={img}
                    alt={`${title} ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Rental Booking */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {costume.categorySlug ? (
              <Link
                href={`/${costume.categorySlug}`}
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                }}
              >
                {categoryName}
              </Link>
            ) : (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                {categoryName}
              </span>
            )}
            {isInStock ? (
              <span className="client-badge-stock client-badge-in-stock">
                ● Đang có sẵn ({quantity} bộ)
              </span>
            ) : (
              <span className="client-badge-stock client-badge-out-stock">
                ● Tạm hết hàng
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>
            {title}
          </h1>

          {color && (
            <div style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
              Màu sắc: <strong>{color}</strong>
            </div>
          )}

          {/* Pricing Box */}
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
              Giá thuê theo ngày:
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#dc2626' }}>
                {formatPrice(dailyRentalPrice)} đ
              </span>
              <span style={{ fontSize: '14px', color: '#64748b' }}>/ ngày (24 giờ)</span>
            </div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '6px' }}>
              ✓ Đã bao gồm phí giặt hấp sau khi trả | Không phụ thu cuối tuần
            </div>
          </div>

          {/* Size Selection */}
          {sizes && sizes.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
                Chọn Kích Cỡ (Size):
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {sizes.map((s, idx) => {
                  const sTitle = s.title || s.sizeId;
                  const isAvailable = s.quantity > 0;
                  const isSelected = selectedSize === sTitle;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!isAvailable}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#eff6ff' : isAvailable ? '#ffffff' : '#f1f5f9',
                        color: isSelected ? '#1e40af' : isAvailable ? '#1e293b' : '#94a3b8',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        textDecoration: isAvailable ? 'none' : 'line-through',
                      }}
                      onClick={() => setSelectedSize(sTitle)}
                    >
                      Size {sTitle} ({s.quantity})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rental Duration Calculator */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
              Số ngày dự kiến thuê:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  style={{ padding: '8px 14px', border: 'none', background: '#f8fafc', cursor: 'pointer', fontSize: '16px' }}
                  onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                >
                  -
                </button>
                <span style={{ padding: '8px 16px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>
                  {rentalDays} ngày
                </span>
                <button
                  type="button"
                  style={{ padding: '8px 14px', border: 'none', background: '#f8fafc', cursor: 'pointer', fontSize: '16px' }}
                  onClick={() => setRentalDays(rentalDays + 1)}
                >
                  +
                </button>
              </div>

              <div style={{ fontSize: '14px', color: '#475569' }}>
                Tổng tạm tính: <strong style={{ color: '#dc2626', fontSize: '18px' }}>{formatPrice(totalPrice)} đ</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: 'auto' }}>
            <a
              href={`tel:0987654321`}
              className="btn-card-rent"
              style={{
                padding: '14px 28px',
                fontSize: '15px',
                flex: 1,
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              📞 Gọi Đặt Giữ Đồ Ngay: 0987.654.321
            </a>
            <Link
              href="/register"
              className="client-btn-login"
              style={{ padding: '14px 22px', fontSize: '14px' }}
            >
              Đăng Ký Hội Viên Nhận Giảm 10%
            </Link>
          </div>
        </div>
      </div>

      {/* Description & Policies Box */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--client-border)',
          padding: '32px',
          boxShadow: 'var(--client-shadow-sm)',
          marginBottom: '50px',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
          Mô Tả Chi Tiết & Hướng Dẫn Bảo Quản
        </h3>
        <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.8' }}>
          {description ? (
            <p>{description}</p>
          ) : (
            <p>
              Mẫu trang phục được may thủ công với chất liệu vải cao cấp, giữ phom đứng dáng, đường kim mũi chỉ chắc chắn.
              Thích hợp cho các buổi biểu diễn văn nghệ, chụp ảnh kỷ yếu, lễ hội Tết, sự kiện công ty hoặc dự tiệc.
            </p>
          )}

          <h4 style={{ fontSize: '15px', fontWeight: '700', marginTop: '20px', marginBottom: '8px' }}>
            📋 Quy định nhận đồ & hoàn trả:
          </h4>
          <ul>
            <li>Khách hàng kiểm tra tình trạng phụ kiện và trang phục trước khi nhận ra khỏi tiệm.</li>
            <li>Đặt cọc: Để lại CCCD hoặc tiền cọc tương ứng theo quy định của cửa hàng.</li>
            <li>Khách hàng KHÔNG cần tự giặt ủi đồ sau khi sử dụng; tiệm sẽ giặt hấp khử khuẩn chuyên dụng.</li>
            <li>Nếu có nhu cầu mượn thêm phụ kiện kèm theo (quạt múa, vấn cài, trâm...), vui lòng liên hệ nhân viên tư vấn.</li>
          </ul>
        </div>
      </div>

      {/* Related Costumes */}
      {related && related.length > 0 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
            Gợi Ý Trang Phục Cùng Danh Mục
          </h3>
          <div className="costumes-grid">
            {related.map((item) => (
              <CostumeCard key={item._id} costume={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CostumeDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="costumes-page-wrapper" style={{ textAlign: 'center', padding: '100px 0' }}>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Đang nạp thông tin trang phục...</p>
        </div>
      }
    >
      <CostumeDetailContent params={params} />
    </Suspense>
  );
}
