'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/costumes/detail.css';

export default function CostumeDetailPage() {
  const [costume, setCostume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Lấy id trực tiếp từ URL trình duyệt
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) return;

    const fetchCostume = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/admin/costumes/detail/${id}`);
        if (res.data.success) {
          setCostume(res.data.data);
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
    return <div style={{ padding: '24px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

  if (errorMessage || !costume) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#dc3545' }}>
        <p>{errorMessage || 'Không tìm thấy dữ liệu'}</p>
        <Link href="/admin/costumes" className="btn-secondary" style={{ display: 'inline-block', marginTop: '12px' }}>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="costume-detail-card">
      <div className="costume-detail-header">
        Chi tiết trang phục
      </div>

      <div className="costume-detail-body">
        <div className="costume-detail-layout">
          <div className="costume-detail-img-box">
            {costume.image ? (
              <img src={costume.image} alt={costume.title} className="costume-detail-img" />
            ) : (
              <div style={{ height: '270px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ced4da', borderRadius: '4px', color: '#adb5bd' }}>
                Không có ảnh
              </div>
            )}
          </div>

          <div className="costume-detail-info">
            <div className="detail-row">
              <div className="detail-label">Tên trang phục:</div>
              <div className="detail-value"><strong>{costume.title}</strong></div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Danh mục:</div>
              <div className="detail-value">{costume.categoryName || '—'}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Màu sắc:</div>
              <div className="detail-value">{costume.color || '—'}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Giá thuê / ngày:</div>
              <div className="detail-value" style={{ color: '#198754', fontWeight: 600 }}>
                {costume.dailyRentalPrice ? `${costume.dailyRentalPrice.toLocaleString('vi-VN')} đ` : '0 đ'}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Tổng tồn kho:</div>
              <div className="detail-value"><strong>{costume.quantity ?? 0}</strong></div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Tồn kho theo Size:</div>
              <div className="detail-value">
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

            <div className="detail-row">
              <div className="detail-label">Mô tả chi tiết:</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-line' }}>
                {costume.description || 'Chưa có mô tả'}
              </div>
            </div>
          </div>
        </div>

        <div className="costume-detail-actions">
          <Link href="/admin/costumes" className="btn-secondary">
            Quay lại
          </Link>
          <Link href={`/admin/costumes/edit/${costume._id}`} className="btn-primary" style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#000' }}>
            Chỉnh sửa
          </Link>
        </div>
      </div>
    </div>
  );
}