'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/css/admin/costumes/create.css';

export default function EditCostumePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    color: '',
    dailyRentalPrice: '',
    description: ''
  });

  // Quản lý ảnh: ảnh đã lưu trên Cloudinary và ảnh mới chuẩn bị tải lên
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm dọn sạch state và input file
  const resetUploadState = () => {
    setSelectedFiles([]);
    setNewPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) return;

    // Reset sạch trạng thái ảnh upload ngay khi mở trang
    resetUploadState();

    const fetchData = async () => {
      try {
        const createMetaRes = await axios.get('http://localhost:5000/admin/costumes/create');
        let sizeList = [];
        if (createMetaRes.data.success) {
          setCategories(createMetaRes.data.data.categories || []);
          sizeList = createMetaRes.data.data.sizes || [];
          setAvailableSizes(sizeList);
        }

        const costumeRes = await axios.get(`http://localhost:5000/admin/costumes/detail/${id}`);
        if (costumeRes.data.success) {
          const item = costumeRes.data.data;
          setFormData({
            title: item.title || '',
            categoryId: item.categoryId || '',
            color: item.color || '',
            dailyRentalPrice: item.dailyRentalPrice || '',
            description: item.description || ''
          });

          // Nạp chính xác mảng ảnh từ DB
          if (Array.isArray(item.images) && item.images.length > 0) {
            setExistingImages(item.images);
          } else if (item.image) {
            setExistingImages([item.image]);
          } else {
            setExistingImages([]);
          }

          // Đảm bảo không còn vướng ảnh mới nào trong bộ nhớ
          resetUploadState();

          // Map số lượng theo từng size
          const currentQty = {};
          sizeList.forEach((s) => {
            const matched = (item.sizes || []).find((is) => is.sizeId === s._id || is.title === s.title);
            currentQty[s._id] = matched ? matched.quantity : '';
          });
          setSizeQuantities(currentQty);
        } else {
          setErrorMessage('Không thể tìm thấy thông tin trang phục.');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Có lỗi khi lấy dữ liệu trang phục.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Dọn bộ nhớ blob URL khi component unmount
    return () => {
      resetUploadState();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const urls = files.map((f) => URL.createObjectURL(f));
      setNewPreviews((prev) => [...prev, ...urls]);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNewImage = (indexToRemove) => {
    if (newPreviews[indexToRemove]) {
      URL.revokeObjectURL(newPreviews[indexToRemove]);
    }
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSizeQuantityChange = (sizeId, value) => {
    if (value === '') {
      setSizeQuantities((prev) => ({
        ...prev,
        [sizeId]: ''
      }));
      return;
    }

    const parsed = parseInt(value, 10);
    setSizeQuantities((prev) => ({
      ...prev,
      [sizeId]: isNaN(parsed) ? '' : Math.max(0, parsed)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Vui lòng nhập tên trang phục.');
      return;
    }

    if (!formData.categoryId) {
      setErrorMessage('Vui lòng chọn danh mục.');
      return;
    }

    const price = Number(formData.dailyRentalPrice);
    if (!formData.dailyRentalPrice || isNaN(price) || price <= 0) {
      setErrorMessage('Vui lòng nhập giá thuê mỗi ngày lớn hơn 0.');
      return;
    }

    if (existingImages.length === 0 && selectedFiles.length === 0) {
      setErrorMessage('Vui lòng giữ lại hoặc tải lên ít nhất 1 hình ảnh.');
      return;
    }

    const formattedSizes = Object.entries(sizeQuantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([sizeId, quantity]) => ({
        sizeId,
        quantity: Number(quantity)
      }));

    const totalQuantity = formattedSizes.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity < 1) {
      setErrorMessage('Tổng số lượng trang phục phải ít nhất từ 1 trở lên.');
      return;
    }

    setSubmitting(true);
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title.trim());
      dataPayload.append('categoryId', formData.categoryId);
      dataPayload.append('color', formData.color.trim());
      dataPayload.append('dailyRentalPrice', price);
      dataPayload.append('description', formData.description.trim());
      dataPayload.append('sizes', JSON.stringify(formattedSizes));

      // Gửi danh sách các ảnh cũ được giữ lại
      dataPayload.append('existingImages', JSON.stringify(existingImages));

      // Append từng file ảnh mới được thêm
      selectedFiles.forEach((file) => {
        dataPayload.append('images', file);
      });

      const res = await axios.patch(`http://localhost:5000/admin/costumes/edit/${id}`, dataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        // Giải phóng URL bộ nhớ và dọn sạch state
        resetUploadState();
        router.push('/admin/costumes');
        router.refresh();
      } else {
        setErrorMessage(res.data.message || 'Cập nhật trang phục thất bại.');
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
    <div className="costume-create-card">
      <div className="costume-create-header">
        Chỉnh sửa trang phục
      </div>

      <div className="costume-create-body">
        {errorMessage && (
          <div className="alert-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tên trang phục *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Nhập tên trang phục..."
              value={formData.title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoryId">Danh mục *</label>
              <select
                id="categoryId"
                name="categoryId"
                className="form-control"
                value={formData.categoryId}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Màu sắc</label>
              <input
                type="text"
                id="color"
                name="color"
                className="form-control"
                placeholder="Nhập màu..."
                value={formData.color}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dailyRentalPrice">Giá thuê / ngày (VNĐ) *</label>
              <input
                type="number"
                id="dailyRentalPrice"
                name="dailyRentalPrice"
                className="form-control"
                placeholder="vd: 150000"
                min="1"
                value={formData.dailyRentalPrice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Album hình ảnh * (Đang có & Tải thêm)</label>
              <div className="file-upload-box">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  className="file-input-hidden"
                  onChange={handleFilesChange}
                />

                <button
                  type="button"
                  className="btn-upload-file"
                  onClick={handleTriggerFileInput}
                >
                  📁 Chọn thêm ảnh từ máy
                </button>

                <div className="image-album-grid">
                  {/* Ảnh cũ đã lưu trên DB */}
                  {existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} className="image-thumb-card">
                      <img src={url} alt={`Saved ${idx}`} className="image-preview" />
                      <span className="badge-exist-label">Đã lưu</span>
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => handleRemoveExistingImage(idx)}
                        title="Xóa ảnh này"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Ảnh mới vừa chọn từ máy (chưa submit) */}
                  {newPreviews.map((url, idx) => (
                    <div key={`new-${idx}`} className="image-thumb-card new-upload">
                      <img src={url} alt={`New ${idx}`} className="image-preview" />
                      <span className="badge-new-label">Mới</span>
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => handleRemoveNewImage(idx)}
                        title="Hủy ảnh này"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sizes-section">
            <div className="sizes-section-title">Số lượng tồn kho theo Size:</div>
            {availableSizes.map((s) => (
              <div key={s._id} className="size-item-row">
                <span className="size-label">{s.title}:</span>
                <input
                  type="number"
                  min="0"
                  className="form-control size-input-qty"
                  placeholder="0"
                  value={sizeQuantities[s._id] ?? ''}
                  onChange={(e) => handleSizeQuantityChange(s._id, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả chi tiết</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Nhập thông tin mô tả..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Link href="/admin/costumes" className="btn-secondary">
              Quay lại
            </Link>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}