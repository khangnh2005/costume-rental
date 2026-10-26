'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '../../css/admin/categories/style.css';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id, name) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`);
    if (!isConfirm) return;

    try {
      const res = await axios.patch(`http://localhost:5000/admin/categories/delete/${id}`);
      if (res.data.success) {
        // Cập nhật lại danh sách trên UI sau khi xóa thành công
        setCategories((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(res.data.message || 'Xóa danh mục thất bại');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục');
    }
  };

  return (
    <div className="category-card">
      <div className="category-card-header">
        Danh sách
      </div>

      <div className="category-card-body">
        <div className="action-top-bar">
          <Link href="/admin/categories/create" className="btn-add-new">
            + Thêm mới
          </Link>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th style={{ width: '220px' }}>Tên danh mục</th>
              <th>Mô tả</th>
              <th style={{ width: '120px' }}>Trạng thái</th>
              <th style={{ width: '200px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '24px' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td className="category-name">{item.name}</td>
                  <td className="category-desc">{item.description || '—'}</td>
                  <td>
                    <span className="badge-status">
                      Hoạt động
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        href={`/admin/categories/detail/${item._id}`} 
                        className="btn-sm btn-detail"
                      >
                        Chi tiết
                      </Link>
                      <Link 
                        href={`/admin/categories/edit/${item._id}`} 
                        className="btn-sm btn-edit"
                      >
                        Sửa
                      </Link>
                      <button 
                        type="button"
                        onClick={() => handleDelete(item._id, item.name)} 
                        className="btn-sm btn-delete"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '24px' }}>
                  Chưa có danh mục nào trong hệ thống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}