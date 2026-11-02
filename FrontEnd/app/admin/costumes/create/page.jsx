'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function CreateCostumePage() {
  const router = useRouter();

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

  useEffect(() => {
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn nhiều ảnh
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const handleSizeQuantityChange = (sizeId, quantity) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [sizeId]: Math.max(0, parseInt(quantity, 10) || 0)
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

    const sizesPayload = Object.keys(selectedSizes)
      .filter((sId) => selectedSizes[sId] > 0)
      .map((sId) => ({
        sizeId: sId,
        quantity: selectedSizes[sId]
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
    <div style={{ maxWidth: '800px', margin: '24px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #edf2f7', fontWeight: 600, fontSize: '18px' }}>
        Thêm mới trang phục
      </div>

      <div style={{ padding: '24px' }}>
        {errorMessage && (
          <div style={{ padding: '12px', background: '#f8d7da', color: '#842029', borderRadius: '4px', marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Tên trang phục *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tên trang phục"
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Danh mục phân loại *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Màu sắc</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="VD: Trắng..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Giá thuê / ngày (VNĐ) *</label>
            <input
              type="number"
              name="dailyRentalPrice"
              value={formData.dailyRentalPrice}
              onChange={handleChange}
              placeholder="VD: 150000"
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Hình ảnh trang phục (Chọn nhiều ảnh) *</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
              style={{ display: 'block', marginBottom: '10px' }}
            />
            {imagePreviews.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {imagePreviews.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preview ${idx}`}
                    style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Nhập số lượng tồn kho theo Size:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', background: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
              {availableSizes.map((sz) => (
                <div key={sz._id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Size {sz.title}:</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Nhập số lượng"
                    value={selectedSizes[sz._id] || ''}
                    onChange={(e) => handleSizeQuantityChange(sz._id, e.target.value)}
                    style={{ padding: '6px', border: '1px solid #ced4da', borderRadius: '4px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Mô tả chi tiết</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập chất liệu, phụ kiện đi kèm, lưu ý..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <Link
              href="/admin/costumes"
              style={{ padding: '8px 18px', background: '#6c757d', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}
            >
              Quay lại
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '8px 18px', background: '#198754', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {loading ? 'Đang lưu...' : 'Lưu trang phục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}