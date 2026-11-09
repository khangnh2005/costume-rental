import { Suspense } from 'react';
import '@/app/css/client/client.css';
import '@/app/css/client/costumes.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'HK OUTFIT | Cho Thuê Trang Phục Biểu Diễn & Sự Kiện Cao Cấp',
  description:
    'Dịch vụ cho thuê trang phục biểu diễn, áo dài truyền thống, cổ phục Việt Nam, đầm dạ hội uy tín, giá tốt và giặt hấp tiệt trùng 100% tại HK OUTFIT.',
};

export default function ClientLayout({ children }) {
  return (
    <div className="client-app-wrapper">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="client-main-content">{children}</main>
      <Footer />
    </div>
  );
}
