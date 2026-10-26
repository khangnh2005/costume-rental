'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/css/admin/costumes/create.css';

export default function CreateCostumePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({});

  const initialForm = {
    title: '',
    categoryId: '',
    color: '',
    dailyRentalPrice: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetFormState = (catList, sizeList) => {
    setFormData({
      ...initialForm,
      categoryId: catList && catList.length > 0 ? catList[0]._id : ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    const resetQty = {};
    (sizeList || availableSizes).forEach((s) => {
      resetQty[s._id] = '';
    });
    setSizeQuantities(resetQty);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/costumes/create');
        if (res.data.success) {
          const catList = res.data.data.categories || [];
          const sizeList = res.data.data.sizes || [];
          setCategories(catList);
          setAvailableSizes(sizeList);
          resetFormState(catList, sizeList);
        }
      } catch (err) {
        setErrorMessage('Không thể tải danh sách danh mục hoặc size.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    if (!selectedFile) {
      setErrorMessage('Vui lòng chọn hình ảnh cho trang phục.');
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

    setLoading(true);

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title.trim());
      dataPayload.append('categoryId', formData.categoryId);
      dataPayload.append('color', formData.color.trim());
      dataPayload.append('dailyRentalPrice', Number(formData.dailyRentalPrice) || 0);
      dataPayload.append('description', formData.description.trim());
      dataPayload.append('sizes', JSON.stringify(formattedSizes));

      if (selectedFile) {
        dataPayload.append('image', selectedFile);
      }

      const res = await axios.post('http://localhost:5000/admin/costumes/create', dataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        resetFormState(categories, availableSizes);
        router.push('/admin/costumes');
        router.refresh();
      } else {
        setErrorMessage(res.data.message || 'Thêm trang phục thất bại.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi tạo mới trang phục.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="costume-create-card">
      <div className="costume-create-header">
        Thêm trang phục mới
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
                
                value={formData.dailyRentalPrice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Hình Ảnh *</label>
              <div className="file-upload-box">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="file-input-hidden"
                  onChange={handleFileChange}
                />

                <button
                  type="button"
                  className="btn-upload-file"
                  onClick={handleTriggerFileInput}
                >
                  📁 Chọn hình ảnh từ máy
                </button>

                {previewUrl && (
                  <div className="image-preview-container">
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={handleRemoveImage}
                      title="Xóa ảnh"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sizes-section">
            <div className="sizes-section-title">Nhập số lượng tồn kho theo Size:</div>
            {availableSizes.map((s) => (
              <div key={s._id} className="size-item-row">
                <span className="size-label">{s.title}:</span>
                <input
                  type="number"
                  className="form-control size-input-qty"
                  placeholder="Nhập số lượng"
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
              {loading ? 'Đang tải lên & lưu...' : 'Lưu trang phục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}