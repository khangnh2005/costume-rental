'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import '@/app/css/admin/costumes/create.css';

export default function CreateCostumePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    color: '',
    dailyRentalPrice: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm reset toàn bộ dữ liệu của form về trạng thái ban đầu
  const resetForm = () => {
    setFormData({
      title: '',
      categoryId: '',
      color: '',
      dailyRentalPrice: '',
      description: ''
    });
    setSelectedSizes({});
    setImageFiles([]);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    resetForm();
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/costumes/create');
        if (res.data.success) {
          setCategories(res.data.data.categories || []);
          setAvailableSizes(res.data.data.sizes || []);
        }
      } catch (err) {
        setErrorMessage('Không thể nạp dữ liệu danh mục hoặc kích cỡ');
      }
    };
    fetchData();

    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn thêm ảnh từ máy (hỗ trợ chọn nhiều lần liên tiếp, không bị ghi đè)
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewUrls]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý xóa từng ảnh xem trước
  const handleRemoveImage = (indexToRemove) => {
    if (imagePreviews[indexToRemove]) {
      URL.revokeObjectURL(imagePreviews[indexToRemove]);
    }
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSizeQuantityChange = (sizeId, quantity) => {
    if (quantity === '') {
      setSelectedSizes((prev) => ({
        ...prev,
        [sizeId]: ''
      }));
      return;
    }
    const parsed = parseInt(quantity, 10);
    setSelectedSizes((prev) => ({
      ...prev,
      [sizeId]: isNaN(parsed) ? '' : Math.max(0, parsed)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Vui lòng nhập tên trang phục');
      return;
    }

    if (!formData.categoryId) {
      setErrorMessage('Vui lòng chọn danh mục cho trang phục');
      return;
    }

    const price = Number(formData.dailyRentalPrice);
    if (!formData.dailyRentalPrice || isNaN(price) || price <= 0) {
      setErrorMessage('Vui lòng nhập giá thuê mỗi ngày lớn hơn 0');
      return;
    }

    const sizesPayload = Object.keys(selectedSizes)
      .filter((sId) => Number(selectedSizes[sId]) > 0)
      .map((sId) => ({
        sizeId: sId,
        quantity: Number(selectedSizes[sId])
      }));

    if (sizesPayload.length === 0) {
      setErrorMessage('Vui lòng nhập số lượng cho ít nhất 1 kích cỡ');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('categoryId', formData.categoryId);
      data.append('color', formData.color.trim());
      data.append('dailyRentalPrice', formData.dailyRentalPrice);
      data.append('description', formData.description.trim());
      data.append('sizes', JSON.stringify(sizesPayload));

      // Append từng file vào field 'images' để multer.array('images') nhận diện
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          data.append('images', file);
        });
      }

      const res = await axios.post('http://localhost:5000/admin/costumes/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        // Reset sạch toàn bộ form và input trước khi chuyển trang
        resetForm();
        router.push('/admin/costumes');
        router.refresh();
      } else {
        setErrorMessage(res.data.message || 'Thêm trang phục thất bại');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi tạo trang phục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="costume-create-card">
      <div className="costume-create-header">
        Thêm mới trang phục
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
              placeholder="Nhập tên trang phục (vd: Áo dài ngũ thân...)"
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
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
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
                placeholder="Nhập màu (vd: Đỏ, Xanh ngọc...)"
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
              <label>Album hình ảnh * (Thêm mới)</label>
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
                  {imagePreviews.map((url, idx) => (
                    <div key={`img-${idx}`} className="image-thumb-card">
                      <img src={url} alt={`Upload ${idx}`} className="image-preview" />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => handleRemoveImage(idx)}
                        title="Xóa ảnh này"
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
                  value={selectedSizes[s._id] ?? ''}
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
              placeholder="Nhập chất liệu, phụ kiện đi kèm, lưu ý..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Link href="/admin/costumes" className="btn-secondary">
              Quay lại
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu trang phục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
