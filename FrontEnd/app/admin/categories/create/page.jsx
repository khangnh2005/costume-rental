'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/css/admin/categories/create.css';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/admin/categories/create', formData);
      if (res.data.success) {
        router.push('/admin/categories');
      } else {
        setErrorMessage(res.data.message || 'Thêm danh mục thất bại.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi gửi dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-card">
      <div className="category-card-header">
        Thêm danh mục mới
      </div>

      <div className="category-card-body">
        {errorMessage && (
          <div className="alert-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên danh mục *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Nhập tên danh mục (vd: Trang phục Cưới, Áo dài...)"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Nhập mô tả cho danh mục này"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Link href="/admin/categories" className="btn-secondary">
              Quay lại
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}