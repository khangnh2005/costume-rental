'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/css/admin/categories/style.css';

export default function CategoryEditPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) return;

    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/admin/categories/detail/${id}`);
        if (res.data.success) {
          setFormData({
            name: res.data.data.name || '',
            description: res.data.data.description || ''
          });
        } else {
          setErrorMessage(res.data.message || 'Không tìm thấy danh mục.');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Vui lòng nhập tên danh mục.');
      return;
    }

    setSubmitting(true);
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    try {
      const res = await axios.patch(`http://localhost:5000/admin/categories/edit/${id}`, formData);

      if (res.data.success) {
        router.push('/admin/categories');
        router.refresh();
      } else {
        setErrorMessage(res.data.message || 'Cập nhật danh mục thất bại.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thay đổi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="category-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="category-card-header">
        Chỉnh sửa danh mục
      </div>

      <div className="category-card-body">
        {errorMessage && (
          <div style={{ padding: '10px 14px', backgroundColor: '#f8d7da', color: '#842029', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
              Tên danh mục *
            </label>
            <input
              type="text"
              name="name"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box' }}
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
              Mô tả
            </label>
            <textarea
              name="description"
              rows={4}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box' }}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Link href="/admin/categories" style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>
              Hủy
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '8px 18px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}