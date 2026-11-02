'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/categories/detail.css';

function CategoryDetailContent() {
  const params = useParams();
  const id = params?.id;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/admin/categories/detail/${id}`);
        if (res.data.success) {
          setCategory(res.data.data);
        } else {
          setErrorMessage(res.data.message || 'Không thể tải thông tin danh mục');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

  if (errorMessage || !category) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#dc3545' }}>
        <p>{errorMessage || 'Không tìm thấy dữ liệu'}</p>
        <Link href="/admin/categories" className="btn-secondary" style={{ display: 'inline-block', marginTop: '12px' }}>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="category-detail-card">
      <div className="category-detail-header">
        Chi tiết danh mục trang phục
      </div>

      <div className="category-detail-body">
        <div className="detail-row">
          <div className="detail-label">Mã danh mục (ID):</div>
          <div className="detail-value">{category._id}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Tên danh mục:</div>
          <div className="detail-value">
            <strong style={{ fontSize: '16px', color: '#111827' }}>{category.name}</strong>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Danh mục cha trực tiếp:</div>
          <div className="detail-value">
            {category.parentId ? (
              <span style={{ fontWeight: 600, color: '#0d6efd' }}>
                📁 {category.parentName || 'Có danh mục cha'}
              </span>
            ) : (
              <span style={{ backgroundColor: '#e2e3e5', color: '#41464b', padding: '3px 8px', borderRadius: '4px', fontSize: '13px' }}>
                Danh mục gốc (Cấp 1)
              </span>
            )}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Đường dẫn thân thiện (Slug):</div>
          <div className="detail-value" style={{ fontFamily: 'monospace', color: '#0d6efd' }}>
            {category.slug || '—'}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Mô tả phân loại:</div>
          <div className="detail-value">{category.description || 'Chưa có thông tin mô tả'}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Trạng thái hoạt động:</div>
          <div className="detail-value">
            <span style={{ backgroundColor: '#198754', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
              Hoạt động
            </span>
          </div>
        </div>

        <div className="category-detail-actions">
          <Link href="/admin/categories" className="btn-secondary">
            Quay lại danh sách
          </Link>
          <Link
            href={`/admin/categories/edit/${category._id}`}
            className="btn-primary"
            style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#000' }}
          >
            Chỉnh sửa
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>Đang nạp dữ liệu trang...</div>}>
      <CategoryDetailContent />
    </Suspense>
  );
}