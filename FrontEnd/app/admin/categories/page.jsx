'use client';
import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/categories/style.css';

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
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}" không?`)) return;
    try {
      const res = await axios.patch(`http://localhost:5000/admin/categories/delete/${id}`);
      if (res.data.success) {
        fetchCategories();
      }
    } catch (err) {
      alert('Không thể xóa danh mục');
    }
  };

  // Hàm đệ quy render hàng danh mục cha - con dùng Fragment chuẩn HTML
  const renderTableRows = (items, level = 0) => {
    return items.map((item, index) => {
      const prefix = Array(level + 1).join('— ');
      return (
        <Fragment key={item._id}>
          <tr>
            <td>{level === 0 ? index + 1 : ''}</td>
            <td className="category-name" style={{ paddingLeft: `${level * 24 + 12}px` }}>
              <strong>{prefix}</strong> {item.name}
            </td>
            <td className="category-desc">{item.description || '—'}</td>
            <td>
              <span className="badge-status">Hoạt động</span>
            </td>
            <td>
              <div className="action-buttons">
                <Link href={`/admin/categories/detail/${item._id}`} className="btn-sm btn-detail">
                  Chi tiết
                </Link>
                <Link href={`/admin/categories/edit/${item._id}`} className="btn-sm btn-edit">
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
          {item.children && item.children.length > 0 && renderTableRows(item.children, level + 1)}
        </Fragment>
      );
    });
  };

  return (
    <div className="category-card">
      <div className="category-card-header">Danh sách phân cấp loại trang phục</div>
      <div className="category-card-body">
        <div className="action-top-bar">
          <Link href="/admin/categories/create" className="btn-add-new">
            + Thêm mới danh mục
          </Link>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th style={{ width: '280px' }}>Tên phân loại trang phục</th>
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
              renderTableRows(categories)
            ) : (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '24px' }}>
                  Chưa có loại trang phục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}