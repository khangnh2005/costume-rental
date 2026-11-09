'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const err = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      err.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(formData.email.trim())) {
      err.email = 'Email không đúng định dạng (ví dụ: khachhang@gmail.com)';
    }

    if (!formData.password) {
      err.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      err.password = 'Mật khẩu tối thiểu 6 ký tự';
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
      const res = await login(formData.email, formData.password);

      if (res.success) {
        setIsSuccess(true);
        setLoggedInUser(res.user);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setServerError(res.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại email hoặc mật khẩu.');
      }
    } catch (err) {
      setServerError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  // Màn hình thông báo đăng nhập thành công
  if (isSuccess && loggedInUser) {
    return (
      <div className="register-success-box">
        <div className="success-check-icon">✓</div>
        <h2 className="success-title">Đăng Nhập Thành Công!</h2>
        <p className="success-desc">
          Xin chào mừng <strong>{loggedInUser.fullName}</strong> đã quay trở lại với HK OUTFIT!
          Đang chuyển hướng về trang chủ trong giây lát...
        </p>

        <div className="success-user-summary">
          <p>👤 <strong>Họ tên:</strong> {loggedInUser.fullName}</p>
          <p>✉️ <strong>Email:</strong> {loggedInUser.email}</p>
          <p>📞 <strong>Số điện thoại:</strong> {loggedInUser.phone || 'Chưa cập nhật'}</p>
        </div>

        <div className="success-actions-row">
          <Link href="/" className="btn-success-primary">
            Về Trang Chủ Ngay 🏠
          </Link>
          <Link href="/costumes" className="btn-success-secondary">
            Khám Phá Trang Phục 👗
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-form-panel login-form-panel">
      <div className="form-header-block">
        <h1>Đăng Nhập Tài Khoản</h1>
        <p>
          Chưa có tài khoản?{' '}
          <Link href="/register" className="auth-switch-link">
            Đăng ký hội viên ngay
          </Link>{' '}
          để nhận ưu đãi giảm 10%.
        </p>
      </div>

      {serverError && (
        <div className="register-alert register-alert-danger">
          <span>⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form className="register-form" onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="form-field-group">
          <label htmlFor="login-email">
            Địa chỉ Email <span className="required">*</span>
          </label>
          <div className="form-input-wrapper">
            <span className="form-input-icon">✉️</span>
            <input
              type="email"
              id="login-email"
              name="email"
              className={`form-input-text ${errors.email ? 'has-error' : ''}`}
              placeholder="tenban@gmail.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.email && <div className="field-error-msg">{errors.email}</div>}
        </div>

        {/* Password */}
        <div className="form-field-group">
          <div className="form-label-with-link">
            <label htmlFor="login-password">
              Mật khẩu <span className="required">*</span>
            </label>
          </div>
          <div className="form-input-wrapper">
            <span className="form-input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              name="password"
              className={`form-input-text ${errors.password ? 'has-error' : ''}`}
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="btn-toggle-pwd"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label="Hiện/ẩn mật khẩu"
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
          {errors.password && <div className="field-error-msg">{errors.password}</div>}
        </div>

        {/* Remember me & Forgot password */}
        <div className="login-options-row">
          <label className="form-checkbox-label" style={{ margin: 0 }}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <Link href="/register" className="forgot-password-link">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-submit-register"
          disabled={loading}
        >
          {loading ? 'Đang xác thực thông tin...' : '🔑 Đăng Nhập Ngay'}
        </button>
      </form>
    </div>
  );
}
