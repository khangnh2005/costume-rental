'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/css/admin/categories/style.css';

export default function CreateCategoryPage() {
  const router = useRouter();

  const [parentList, setParentList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/categories/create');
        if (res.data.success) {
          setParentList(res.data.data);
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách cha:', err);
      }
    };
    fetchParentCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Vui lòng nhập tên danh mục');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/admin/categories/create', formData);
      if (res.data.success) {
        setFormData({
          name: '',
          parentId: '',
          description: ''
        });
        
        router.push('/admin/categories');
        router.refresh();
      } else {
        setErrorMessage(res.data.message || 'Thêm danh mục thất bại');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="category-card-header">Thêm mới danh mục trang phục</div>
      <div className="category-card-body">
        {errorMessage && (
          <div style={{ padding: '10px 14px', backgroundColor: '#f8d7da', color: '#842029', borderRadius: '4px', marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Tên danh mục *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="VD: Trang phục truyền thống, Áo Dài, Áo Bà Ba..."
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Danh mục cha</label>
            <select
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            >
              <option value="">-- Chọn danh mục cha (Nếu là danh mục lớn thì bỏ trống) --</option>
              {parentList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Mô tả</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập thông tin mô tả danh mục..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Link href="/admin/categories" className="btn-secondary" style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
              Quay lại
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '8px 18px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {loading ? 'Đang lưu...' : 'Thêm danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}