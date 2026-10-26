import Link from 'next/link';
// Kiểm tra đúng đường dẫn đến file CSS layout bạn vừa gửi ở trên:
import '../css/admin/admin.css'; 

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-title">ADMIN</div>
        <div className="admin-header-actions">
          <span className="btn-badge-admin">Admin</span>
          <button type="button" className="btn-logout">Đăng xuất</button>
        </div>
      </header>

      {/* Body */}
      <div className="admin-body">
        <aside className="admin-sidebar">
          <ul className="sidebar-menu">
            <li>
              <Link href="/admin" className="sidebar-link">
                Tổng quan
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="sidebar-link">
                Quản lý danh mục
              </Link>
            </li>
            <li>
              <Link href="/admin/costumes" className="sidebar-link">
                Quản lý trang phục
              </Link>
            </li>
          </ul>
        </aside>

        {/* Nội dung trang */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}