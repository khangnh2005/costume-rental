'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Xóa lỗi trường tương ứng khi người dùng nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const err = {};

    if (!formData.fullName.trim()) {
      err.fullName = 'Vui lòng nhập họ và tên của bạn';
    } else if (formData.fullName.trim().length < 2) {
      err.fullName = 'Họ và tên tối thiểu 2 ký tự';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      err.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(formData.email.trim())) {
      err.email = 'Email không hợp lệ (ví dụ: khachhang@gmail.com)';
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!formData.phone.trim()) {
      err.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone.trim().replace(/\s/g, ''))) {
      err.phone = 'Số điện thoại không hợp lệ (gồm 10 số, ví dụ 0901234567)';
    }

    if (!formData.password) {
      err.password = 'Vui lòng tạo mật khẩu';
    } else if (formData.password.length < 6) {
      err.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      err.confirmPassword = 'Vui lòng xác nhận lại mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      err.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    if (!formData.agreeTerms) {
      err.agreeTerms = 'Bạn cần đồng ý với Điều khoản dịch vụ và chính sách thuê';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (res.success) {
        setIsSuccess(true);
        setRegisteredUser(res.data);
      } else {
        setServerError(res.message || 'Đăng ký không thành công');
      }
    } catch (err) {
      const msg = err.message || 'Có lỗi xảy ra khi kết nối máy chủ';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Màn hình thông báo thành công
  if (isSuccess && registeredUser) {
    return (
      <div className="register-success-box">
        <div className="success-check-icon">✓</div>
        <h2 className="success-title">Đăng Ký Tài Khoản Thành Công!</h2>
        <p className="success-desc">
          Chào mừng <strong>{registeredUser.fullName}</strong> đã trở thành thành viên của HK OUTFIT.
          Thông tin của bạn đã được lưu vào hệ thống cơ sở dữ liệu. Bạn có thể đăng nhập ngay để bắt đầu thuê trang phục!
        </p>

        <div className="success-user-summary">
          <p>👤 <strong>Họ tên:</strong> {registeredUser.fullName}</p>
          <p>✉️ <strong>Email:</strong> {registeredUser.email}</p>
          <p>📞 <strong>Số điện thoại:</strong> {registeredUser.phone}</p>
        </div>

        <div className="success-actions-row">
          <Link href="/login" className="btn-success-primary">
            Đăng Nhập Ngay 🔑
          </Link>
          <Link href="/" className="btn-success-secondary">
            Về Trang Chủ 🏠
          </Link>
          <Link href="/costumes" className="btn-success-secondary">
            Xem Trang Phục 👗
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-form-panel">
      <div className="form-header-block">
        <h1>Tạo Tài Khoản Khách Hàng</h1>
        <p>
          Đã có tài khoản?{' '}
          <Link href="/login" className="auth-switch-link">Đăng nhập tại đây</Link> hoặc tiếp tục khám phá với tư cách khách vãng lai.
        </p>
      </div>

      {serverError && (
        <div className="register-alert register-alert-danger">
          <span>⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form className="register-form" onSubmit={handleSubmit} noValidate>
        {/* Row 1: Full name & Phone */}
        <div className="form-row-2col">
          <div className="form-field-group">
            <label htmlFor="fullName">
              Họ và tên <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <span className="form-input-icon">👤</span>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`form-input-text ${errors.fullName ? 'has-error' : ''}`}
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {errors.fullName && <div className="field-error-msg">{errors.fullName}</div>}
          </div>

          <div className="form-field-group">
            <label htmlFor="phone">
              Số điện thoại <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <span className="form-input-icon">📞</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-input-text ${errors.phone ? 'has-error' : ''}`}
                placeholder="0901 234 567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {errors.phone && <div className="field-error-msg">{errors.phone}</div>}
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="form-field-group">
          <label htmlFor="email">
            Địa chỉ Email <span className="required">*</span>
          </label>
          <div className="form-input-wrapper">
            <span className="form-input-icon">✉️</span>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input-text ${errors.email ? 'has-error' : ''}`}
              placeholder="tenban@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <div className="field-error-msg">{errors.email}</div>}
        </div>

        {/* Row 3: Password & Confirm Password */}
        <div className="form-row-2col">
          <div className="form-field-group">
            <label htmlFor="password">
              Mật khẩu <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <span className="form-input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input-text ${errors.password ? 'has-error' : ''}`}
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {errors.password && <div className="field-error-msg">{errors.password}</div>}
          </div>

          <div className="form-field-group">
            <label htmlFor="confirmPassword">
              Xác nhận mật khẩu <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <span className="form-input-icon">🔒</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input-text ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn-toggle-pwd"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="field-error-msg">{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        {/* Checkbox: Terms */}
        <div>
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <span>
              Tôi đã đọc và đồng ý với <Link href="/">Điều khoản dịch vụ</Link> và{' '}
              <Link href="/">Chính sách bảo quản & thuê trang phục</Link>.
            </span>
          </label>
          {errors.agreeTerms && (
            <div className="field-error-msg" style={{ marginLeft: '26px' }}>
              {errors.agreeTerms}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-submit-register"
          disabled={loading}
        >
          {loading ? 'Đang tạo tài khoản...' : '✨ Hoàn Tất Đăng Ký Tài Khoản'}
        </button>
      </form>
    </div>
  );
}
