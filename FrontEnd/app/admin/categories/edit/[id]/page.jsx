'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

function CategoryEditContent() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    description: ''
  });
  const [parentList, setParentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Tải song song cả thông tin danh mục hiện tại và danh sách danh mục cha
        const [categoryRes, parentsRes] = await Promise.all([
          axios.get(`http://localhost:5000/admin/categories/detail/${id}`),
          axios.get('http://localhost:5000/admin/categories/create')
        ]);

        if (categoryRes.data.success) {
          const cat = categoryRes.data.data;
          setFormData({
            name: cat.name || '',
            parentId: cat.parentId ? String(cat.parentId) : '',
            description: cat.description || ''
          });
        }

        if (parentsRes.data.success) {
          // Lọc bỏ chính danh mục hiện tại ra khỏi danh sách chọn làm cha
          const filteredParents = parentsRes.data.data.filter(
            (item) => String(item._id) !== String(id)
          );
          setParentList(filteredParents);
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi nạp dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      setErrorMessage('Vui lòng nhập tên danh mục');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.patch(`http://localhost:5000/admin/categories/edit/${id}`, formData);
      if (res.data.success) {
        router.push('/admin/categories');
        router.refresh();
      } else {
        setErrorMessage(res.data.message || 'Cập nhật danh mục thất bại');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Đang nạp dữ liệu danh mục...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '24px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #edf2f7', fontWeight: 600, fontSize: '18px' }}>
        Chỉnh sửa danh mục
      </div>

      <div style={{ padding: '24px' }}>
        {errorMessage && (
          <div style={{ padding: '12px', background: '#f8d7da', color: '#842029', borderRadius: '4px', marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Tên danh mục *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Áo Dài, Áo Tứ Thân..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Danh mục cha
            </label>
            <select
              name="parentId"
              value={formData.parentId ?? ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            >
              <option value="">-- Chọn danh mục cha (Để trống nếu là danh mục gốc) --</option>
              {parentList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Mô tả
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập thông tin mô tả danh mục..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <Link
              href="/admin/categories"
              style={{ padding: '8px 18px', background: '#6c757d', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '8px 18px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoryEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>Đang nạp dữ liệu trang...</div>}>
      <CategoryEditContent />
    </Suspense>
  );
}