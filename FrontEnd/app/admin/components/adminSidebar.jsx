'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <h2>ADMIN</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link 
              href="/admin" 
              className={pathname === '/admin' ? 'active' : ''}
            >
              Tổng quan
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/categories" 
              className={pathname.startsWith('/admin/categories') ? 'active' : ''}
            >
              Quản lý danh mục
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/costumes" 
              className={pathname.startsWith('/admin/costumes') ? 'active' : ''}
            >
              Quản lý trang phục
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}