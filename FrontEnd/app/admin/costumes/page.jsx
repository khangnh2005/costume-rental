'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/costumes/style.css';

export default function CostumeListPage() {
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCostumes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/costumes');
      if (res.data.success) {
        setCostumes(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách trang phục:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostumes();
  }, []);

  const handleDelete = async (id, title) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa trang phục "${title}" không?`);
    if (!isConfirm) return;

    try {
      const res = await axios.patch(`http://localhost:5000/admin/costumes/delete/${id}`);
      if (res.data.success) {
        setCostumes((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(res.data.message || 'Xóa trang phục thất bại');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa trang phục');
    }
  };

  return (
    <div className="costume-card">
      <div className="costume-card-header">
        Danh sách trang phục
      </div>

      <div className="costume-card-body">
        <div className="action-top-bar">
          <Link href="/admin/costumes/create" className="btn-add-new">
            + Thêm trang phục
          </Link>
        </div>

        <table className="costume-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th style={{ width: '80px' }}>Ảnh</th>
              <th>Tên trang phục</th>
              <th>Danh mục</th>
              <th>Giá thuê/ngày</th>
              <th>Size & Tồn kho</th>
              <th style={{ width: '80px' }}>Tổng kho</th>
              <th style={{ width: '100px' }}>Trạng thái</th>
              <th style={{ width: '180px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center" style={{ padding: '24px' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : costumes.length > 0 ? (
              costumes.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="costume-thumb"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>
                    <div className="costume-name">{item.title}</div>
                    {item.color && (
                      <div className="costume-color">Màu: {item.color}</div>
                    )}
                  </td>
                  <td>{item.categoryName || item.categoryTitle || '—'}</td>
                  <td>
                    {item.dailyRentalPrice
                      ? `${item.dailyRentalPrice.toLocaleString('vi-VN')} đ`
                      : '0 đ'}
                  </td>
                  <td>
                    <div className="size-badge-list">
                      {item.sizes && item.sizes.length > 0
                        ? item.sizes.map((s, idx) => (
                            <span key={idx} className="size-badge">
                              {s.title}: {s.quantity}
                            </span>
                          ))
                        : '—'}
                    </div>
                  </td>
                  <td>
                    <strong>{item.quantity ?? 0}</strong>
                  </td>
                  <td>
                    <span className="badge-status">
                      Hoạt động
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        href={`/admin/costumes/detail/${item._id}`}
                        className="btn-sm btn-detail"
                      >
                        Chi tiết
                      </Link>
                      <Link
                        href={`/admin/costumes/edit/${item._id}`}
                        className="btn-sm btn-edit"
                      >
                        Sửa
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id, item.title)}
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
                <td colSpan="9" className="text-center" style={{ padding: '24px' }}>
                  Chưa có trang phục nào trong danh sách.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}