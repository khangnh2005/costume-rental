'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/costumes/style.css';

export default function CostumeListPage() {
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'table'

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

  const filteredCostumes = costumes.filter((item) =>
    (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.color || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="costume-page-container">
      {/* Header bar */}
      <div className="costume-header-card">
        <div className="costume-header-title">
          <h2>Quản lý Trang Phục Cho Thuê</h2>
          <span>Tổng số: <strong>{filteredCostumes.length}</strong> trang phục</span>
        </div>

        <div className="costume-header-actions">
          <input
            type="text"
            className="costume-search-input"
            placeholder="Tìm theo tên, màu, danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`btn-toggle-view ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Dạng Thẻ
            </button>
            <button
              type="button"
              className={`btn-toggle-view ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              ☰ Dạng Bảng
            </button>
          </div>

          <Link href="/admin/costumes/create" className="btn-add-primary">
            + Thêm trang phục
          </Link>
        </div>
      </div>

      {/* Hiển thị danh sách */}
      {loading ? (
        <div className="costume-state-box">Đang tải dữ liệu...</div>
      ) : filteredCostumes.length === 0 ? (
        <div className="costume-state-box">Không có trang phục nào phù hợp.</div>
      ) : viewMode === 'grid' ? (
        /* Dạng Thẻ (Card Grid) */
        <div className="costume-grid">
          {filteredCostumes.map((item) => {
            const displayImage = (item.images && item.images.length > 0) ? item.images[0] : item.image;
            const totalImages = item.images?.length || (item.image ? 1 : 0);

            return (
              <div key={item._id} className="costume-card-item">
                <div className="card-thumb-wrapper">
                  {displayImage ? (
                    <img src={displayImage} alt={item.title} className="card-thumb-img" />
                  ) : (
                    <div className="card-no-img">Chưa có hình ảnh</div>
                  )}

                  {totalImages > 0 && (
                    <span className="badge-image-count">📷 {totalImages} ảnh</span>
                  )}

                  <span className="badge-category-tag">
                    {item.categoryName || 'Chưa phân loại'}
                  </span>
                </div>

                <div className="card-info-content">
                  <h3 className="card-costume-title">{item.title}</h3>

                  <div className="card-price-color-row">
                    <span className="card-price-text">
                      {item.dailyRentalPrice ? `${item.dailyRentalPrice.toLocaleString('vi-VN')} đ` : '0 đ'}
                      <span className="card-price-unit"> /ngày</span>
                    </span>
                    {item.color && (
                      <span className="card-color-tag">Màu: {item.color}</span>
                    )}
                  </div>

                  <div className="card-sizes-block">
                    <div className="sizes-summary-row">
                      <span>Size & tồn kho:</span>
                      <strong>Tổng: {item.quantity ?? 0} bộ</strong>
                    </div>
                    <div className="sizes-badge-group">
                      {item.sizes && item.sizes.length > 0 ? (
                        item.sizes.map((s, idx) => (
                          <span key={idx} className="size-pill">
                            {s.title}: <strong>{s.quantity}</strong>
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Chưa thiết lập size</span>
                      )}
                    </div>
                  </div>

                  <div className="card-actions-row">
                    <Link
                      href={`/admin/costumes/detail/${item._id}`}
                      className="btn-card-action btn-card-detail"
                    >
                      Chi tiết
                    </Link>
                    <Link
                      href={`/admin/costumes/edit/${item._id}`}
                      className="btn-card-action btn-card-edit"
                    >
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id, item.title)}
                      className="btn-card-action btn-card-delete"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dạng Bảng (Table View) */
        <div className="costume-table-card">
          <table className="costume-data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th style={{ width: '90px' }}>Ảnh</th>
                <th>Tên trang phục</th>
                <th>Danh mục</th>
                <th>Giá thuê/ngày</th>
                <th>Kích cỡ & Tồn kho</th>
                <th style={{ width: '90px' }}>Tổng kho</th>
                <th style={{ width: '170px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCostumes.map((item, index) => {
                const displayImage = (item.images && item.images.length > 0) ? item.images[0] : item.image;
                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      {displayImage ? (
                        <div className="table-thumb-wrapper">
                          <img src={displayImage} alt={item.title} className="table-thumb-img" />
                          {item.images?.length > 1 && (
                            <span className="table-photo-badge">+{item.images.length}</span>
                          )}
                        </div>
                      ) : (
                        <div className="table-no-img">No img</div>
                      )}
                    </td>
                    <td>
                      <div className="table-costume-name">{item.title}</div>
                      {item.color && <div className="table-costume-color">Màu: {item.color}</div>}
                    </td>
                    <td>
                      <span className="category-pill">{item.categoryName || '—'}</span>
                    </td>
                    <td className="price-text-highlight">
                      {item.dailyRentalPrice ? `${item.dailyRentalPrice.toLocaleString('vi-VN')} đ` : '0 đ'}
                    </td>
                    <td>
                      <div className="sizes-badge-group">
                        {item.sizes && item.sizes.length > 0
                          ? item.sizes.map((s, idx) => (
                              <span key={idx} className="size-pill">
                                {s.title}: <strong>{s.quantity}</strong>
                              </span>
                            ))
                          : '—'}
                      </div>
                    </td>
                    <td><strong>{item.quantity ?? 0}</strong></td>
                    <td>
                      <div className="table-actions-group">
                        <Link href={`/admin/costumes/detail/${item._id}`} className="table-btn table-btn-detail">
                          Chi tiết
                        </Link>
                        <Link href={`/admin/costumes/edit/${item._id}`} className="table-btn table-btn-edit">
                          Sửa
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.title)}
                          className="table-btn table-btn-delete"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}