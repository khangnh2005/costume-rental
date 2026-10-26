'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/categories/detail.css';

export default function CategoryDetailPage() {
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
        Chi tiết danh mục
      </div>

      <div className="category-detail-body">
        <div className="detail-row">
          <div className="detail-label">Mã danh mục (ID):</div>
          <div className="detail-value">{category._id}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Tên danh mục:</div>
          <div className="detail-value"><strong>{category.name}</strong></div>
        </div>

        <div className="detail-row">
          <div className="detail-label"> (Slug):</div>
          <div className="detail-value" style={{ fontFamily: 'monospace', color: '#0d6efd' }}>
            {category.slug || '—'}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Mô tả:</div>
          <div className="detail-value">{category.description || '—'}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Trạng thái:</div>
          <div className="detail-value">
            <span style={{ backgroundColor: '#198754', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
              Hoạt động
            </span>
          </div>
        </div>

        <div className="category-detail-actions">
          <Link href="/admin/categories" className="btn-secondary">
            Quay lại
          </Link>
          <Link href={`/admin/categories/edit/${category._id}`} className="btn-primary" style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#000' }}>
            Chỉnh sửa
          </Link>
        </div>
      </div>
    </div>
  );
}