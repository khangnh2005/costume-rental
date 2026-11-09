'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Chỉ lấy danh mục thực tế từ Database
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quản lý hover chính xác bằng React State
  const [hoveredL1, setHoveredL1] = useState(null);
  const [hoveredL2, setHoveredL2] = useState(null);

  // Accordion mở rộng trên mobile
  const [openL1Mobile, setOpenL1Mobile] = useState({});
  const [openL2Mobile, setOpenL2Mobile] = useState({});

  // Lấy danh mục từ Backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        let res;
        try {
          res = await axios.get('http://localhost:5000/client/categories');
        } catch {
          res = await axios.get('http://127.0.0.1:5000/client/categories');
        }
        if (isMounted && res.data && res.data.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục từ cơ sở dữ liệu:', err);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/costumes?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/costumes');
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileL1 = (id) => {
    setOpenL1Mobile((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMobileL2 = (id) => {
    setOpenL2Mobile((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* 1. Thanh thông báo ưu đãi trên cùng */}
      <div className="client-promo-strip">
        <span>Thuê 3 ngày tính giá 1 ngày</span>
      </div>

      {/* 2. Topbar thông tin & liên hệ */}
      <div className="client-topbar-pink">
        <div className="client-topbar-inner">
          <div className="client-topbar-left">
            <span>
              Hotline / Zalo: <strong>095 490 7714</strong>
            </span>
            <span className="client-topbar-divider">|</span>
            <span>Giờ mở cửa: 9h - 20h mỗi ngày</span>
          </div>

          <div className="client-topbar-right">
            <Link href="/register" className="client-topbar-notice">
              <span className="client-notice-icon">🔔</span>
              <span>Thông báo của tôi</span>
              <span className="client-notice-badge">5</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Header chính */}
      <header className="client-main-header">
        <div className="client-header-container">
          {/* Logo Thương hiệu */}
          <Link href="/" className="client-brand-logo">
            <div className="client-brand-badge">HK</div>
            <div className="client-brand-text">
              <span className="client-brand-title">Trang Phục Biểu Diễn</span>
              <span className="client-brand-sub">HK OUTFIT VIỆT NAM</span>
            </div>
          </Link>

          {/* Ô tìm kiếm + Cam kết dịch vụ */}
          <div className="client-search-wrapper">
            <form className="client-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="client-search-input"
              />
              <button type="submit" className="client-search-btn" aria-label="Tìm kiếm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>

            <div className="client-search-badges">
              <span className="client-trust-item">
                <span className="client-trust-check">✓</span> Giá minh bạch - Có hóa đơn chứng từ
              </span>
              <span className="client-trust-item">
                <span className="client-trust-check">✓</span> Mẫu mã đa dạng - Dịch vụ tận tình
              </span>
              <span className="client-trust-item">
                <span className="client-trust-check">✓</span> Ship nhanh - Giao online toàn quốc
              </span>
            </div>
          </div>

          {/* Tiện ích bên phải */}
          <div className="client-header-actions">
            <div className="client-action-box client-hide-mobile">
              <span className="client-action-icon">📍</span>
              <div className="client-action-info">
                <span className="client-action-label">
                  Giao hoặc đến lấy tại <span className="client-caret-down">▾</span>
                </span>
                <span className="client-action-val">HK OUTFIT HCM...</span>
              </div>
            </div>

            {/* Khu vực Tài khoản / Đăng Nhập - Đăng Ký */}
            <div
              className="client-account-wrapper client-hide-mobile"
              onMouseEnter={() => setAccountDropdownOpen(true)}
              onMouseLeave={() => setAccountDropdownOpen(false)}
            >
              {user ? (
                // Khi đã đăng nhập: Hiển thị Tài khoản của <Tên người dùng>
                <div className="client-action-box client-account-logged-box">
                  <span className="client-action-icon">👤</span>
                  <div className="client-action-info">
                    <span className="client-action-label">
                      Tài khoản của <span className="client-caret-down">▾</span>
                    </span>
                    <span className="client-action-val" title={user.fullName}>
                      {user.fullName}
                    </span>
                  </div>
                </div>
              ) : (
                // Khi chưa đăng nhập: Nút Đăng Nhập/Đăng Ký
                <Link href="/login" className="client-action-box client-auth-action-btn">
                  <span className="client-action-icon">👤</span>
                  <div className="client-action-info">
                    <span className="client-action-label">
                      Tài khoản <span className="client-caret-down">▾</span>
                    </span>
                    <span className="client-action-val client-auth-btn-label">
                      Đăng Nhập / Đăng Ký
                    </span>
                  </div>
                </Link>
              )}

              {/* Menu Dropdown hiển thị khi hover */}
              {accountDropdownOpen && (
                <div className="client-account-dropdown">
                  {user ? (
                    <div className="client-dropdown-auth-inner">
                      <div className="client-dropdown-user-header">
                        <div className="client-dropdown-user-avatar">👤</div>
                        <div className="client-dropdown-user-meta">
                          <span className="client-dropdown-user-name">{user.fullName}</span>
                          <span className="client-dropdown-user-email">{user.email}</span>
                          {user.phone && <span className="client-dropdown-user-phone">📞 {user.phone}</span>}
                        </div>
                      </div>
                      <div className="client-dropdown-divider"></div>
                      <div className="client-dropdown-links">
                        <Link
                          href="/costumes"
                          className="client-dropdown-item"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          <span>👗</span> Bộ sưu tập trang phục
                        </Link>
                        <button
                          type="button"
                          className="client-dropdown-item client-dropdown-logout-item"
                          onClick={() => {
                            logout();
                            setAccountDropdownOpen(false);
                          }}
                        >
                          <span>🚪</span> Đăng xuất
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="client-dropdown-guest-inner">
                      <div className="client-dropdown-guest-head">
                        <strong>Chào mừng bạn đến với HK OUTFIT!</strong>
                        <p>Đăng nhập để nhận ưu đãi thuê trang phục và quản lý đơn thuê.</p>
                      </div>
                      <div className="client-dropdown-guest-buttons">
                        <Link
                          href="/login"
                          className="client-dropdown-btn-login"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          🔑 Đăng Nhập
                        </Link>
                        <Link
                          href="/register"
                          className="client-dropdown-btn-register"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          ✨ Đăng Ký Hội Viên
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href="/costumes" className="client-cart-box">
              <div className="client-cart-icon-wrap">
                <span className="client-cart-icon">🛍️</span>
                <span className="client-cart-badge">0</span>
              </div>
              <span className="client-cart-text">Giỏ hàng</span>
            </Link>

            {/* Nút bật tắt menu mobile */}
            <button
              type="button"
              className="client-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* 4. Thanh danh mục điều hướng đa cấp: DANH MỤC LỚN -> CHA -> CON TỪ DATABASE */}
        <nav className="client-cat-navbar">
          <div className="client-cat-nav-container">
            <ul className="client-cat-list">
              {/* Trang chủ */}
              <li className="client-cat-item">
                <Link
                  href="/"
                  className={`client-cat-link ${pathname === '/' ? 'active' : ''}`}
                >
                  Trang Chủ
                </Link>
              </li>

              {/* Tất cả trang phục */}
              <li className="client-cat-item">
                <Link
                  href="/costumes"
                  className={`client-cat-link ${pathname === '/costumes' ? 'active' : ''}`}
                >
                  Tất Cả Trang Phục
                </Link>
              </li>

              {/* Danh sách danh mục lớn từ DB */}
              {categories.map((l1) => {
                const hasCha = Array.isArray(l1.children) && l1.children.length > 0;
                const isL1Active = pathname === `/${l1.slug}`;
                const isHovered = hoveredL1 === l1._id;

                return (
                  <li
                    key={l1._id || l1.slug}
                    className={`client-cat-item ${isHovered ? 'is-active-dropdown' : ''}`}
                    onMouseEnter={() => setHoveredL1(l1._id)}
                    onMouseLeave={() => {
                      setHoveredL1(null);
                      setHoveredL2(null);
                    }}
                  >
                    <Link
                      href={`/${l1.slug || ''}`}
                      className={`client-cat-link ${isL1Active ? 'active' : ''}`}
                    >
                      <span>{l1.name}</span>
                      {hasCha && <span className="client-arrow-down">⌵</span>}
                    </Link>

                    {/* Menu cấp 2: DANH MỤC CHA */}
                    {hasCha && (
                      <div
                        className="client-cat-dropdown"
                        style={{ display: isHovered ? 'block' : undefined }}
                      >
                        <ul className="client-cat-dropdown-list">
                          {l1.children.map((l2) => {
                            const hasCon = Array.isArray(l2.children) && l2.children.length > 0;
                            const isL2Active = pathname === `/${l2.slug}`;
                            const isL2Hovered = hoveredL2 === l2._id;

                            return (
                              <li
                                key={l2._id || l2.slug}
                                className={`client-cat-dropdown-item ${isL2Hovered ? 'is-active-submenu' : ''}`}
                                onMouseEnter={() => setHoveredL2(l2._id)}
                                onMouseLeave={() => setHoveredL2(null)}
                              >
                                <Link
                                  href={`/${l2.slug || ''}`}
                                  className={`client-cat-dropdown-link ${isL2Active ? 'active' : ''}`}
                                >
                                  <span className="client-cat-item-text">{l2.name}</span>
                                  {hasCon && <span className="client-arrow-right">›</span>}
                                </Link>

                                {/* Menu cấp 3: DANH MỤC CON */}
                                {hasCon && (
                                  <div
                                    className="client-cat-submenu"
                                    style={{ display: isL2Hovered ? 'block' : undefined }}
                                  >
                                    <ul className="client-cat-submenu-list">
                                      {l2.children.map((l3) => {
                                        const isL3Active = pathname === `/${l3.slug}`;
                                        return (
                                          <li key={l3._id || l3.slug} className="client-cat-submenu-item">
                                            <Link
                                              href={`/${l3.slug || ''}`}
                                              className={`client-cat-submenu-link ${isL3Active ? 'active' : ''}`}
                                            >
                                              {l3.name}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {/* 5. Menu rút gọn cho Mobile */}
      {mobileMenuOpen && (
        <div className="client-mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="client-mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="client-mobile-drawer-header">
              <div className="client-brand-badge">HK</div>
              <span className="client-mobile-drawer-title">Danh Mục Sản Phẩm</span>
              <button
                type="button"
                className="client-mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <form className="client-mobile-search" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Tìm trang phục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>

            <div className="client-mobile-tree">
              <div className="client-mobile-l1-block">
                <div className="client-mobile-l1-header">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="client-mobile-l1-link"
                  >
                    Trang Chủ
                  </Link>
                </div>
              </div>

              <div className="client-mobile-l1-block">
                <div className="client-mobile-l1-header">
                  <Link
                    href="/costumes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="client-mobile-l1-link"
                  >
                    Tất Cả Trang Phục
                  </Link>
                </div>
              </div>

              {categories.map((l1) => {
                const hasCha = Array.isArray(l1.children) && l1.children.length > 0;
                const isL1Open = !!openL1Mobile[l1._id];

                return (
                  <div key={l1._id} className="client-mobile-l1-block">
                    <div className="client-mobile-l1-header">
                      <Link
                        href={`/${l1.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="client-mobile-l1-link"
                      >
                        {l1.name}
                      </Link>
                      {hasCha && (
                        <button
                          type="button"
                          className="client-mobile-expander"
                          onClick={() => toggleMobileL1(l1._id)}
                        >
                          {isL1Open ? '−' : '+'}
                        </button>
                      )}
                    </div>

                    {hasCha && isL1Open && (
                      <div className="client-mobile-l2-container">
                        {l1.children.map((l2) => {
                          const hasCon = Array.isArray(l2.children) && l2.children.length > 0;
                          const isL2Open = !!openL2Mobile[l2._id];

                          return (
                            <div key={l2._id} className="client-mobile-l2-block">
                              <div className="client-mobile-l2-header">
                                <Link
                                  href={`/${l2.slug}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="client-mobile-l2-link"
                                >
                                  {l2.name}
                                </Link>
                                {hasCon && (
                                  <button
                                    type="button"
                                    className="client-mobile-expander sub"
                                    onClick={() => toggleMobileL2(l2._id)}
                                  >
                                    {isL2Open ? '−' : '+'}
                                  </button>
                                )}
                              </div>

                              {hasCon && isL2Open && (
                                <div className="client-mobile-l3-container">
                                  {l2.children.map((l3) => (
                                    <Link
                                      key={l3._id}
                                      href={`/${l3.slug}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="client-mobile-l3-link"
                                    >
                                      • {l3.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="client-mobile-footer-actions">
              {user ? (
                <div className="client-mobile-user-card">
                  <div className="client-mobile-user-info">
                    <span className="client-mobile-user-title">Tài khoản của:</span>
                    <strong className="client-mobile-user-name">{user.fullName}</strong>
                    <span className="client-mobile-user-email">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    className="client-mobile-logout-btn"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="client-mobile-auth-grid">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="client-mobile-action-pill client-mobile-login-pill"
                  >
                    🔑 Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="client-mobile-action-pill client-mobile-register-pill"
                  >
                    ✨ Đăng ký
                  </Link>
                </div>
              )}
              <div className="client-mobile-hotline">
                📞 Hotline: <strong>095 490 7714</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
