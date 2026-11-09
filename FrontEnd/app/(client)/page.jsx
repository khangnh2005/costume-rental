'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '@/app/css/client/home.css';

import HeroBanner from './components/HeroBanner';
import CategorySection from './components/CategorySection';
import FeaturedCostumes from './components/FeaturedCostumes';
import RentalSteps from './components/RentalSteps';
import ServiceHighlights from './components/ServiceHighlights';
import CostumeDetailModal from './components/CostumeDetailModal';

export default function ClientHomePage() {
  const [costumes, setCostumes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewCostume, setQuickViewCostume] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách trang phục
        let costumesRes;
        try {
          costumesRes = await axios.get('http://127.0.0.1:5000/client/costumes');
        } catch {
          costumesRes = await axios.get('http://localhost:5000/admin/costumes');
        }
        if (costumesRes.data && costumesRes.data.data) {
          setCostumes(costumesRes.data.data);
        }

        // Lấy danh sách danh mục
        let catRes;
        try {
          catRes = await axios.get('http://127.0.0.1:5000/client/categories');
        } catch {
          catRes = await axios.get('http://localhost:5000/admin/categories');
        }
        if (catRes.data && catRes.data.data) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error('Lỗi nạp dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* 1. Hero Banner */}
      <HeroBanner totalCostumes={costumes.length} />

      {/* 2. Danh mục nổi bật */}
      <CategorySection categories={categories} />

      {/* 3. Trang phục tiêu biểu & Mới nhất */}
      <FeaturedCostumes
        costumes={costumes}
        categories={categories}
        onQuickView={(costume) => setQuickViewCostume(costume)}
      />

      {/* 4. Quy trình thuê 4 bước */}
      <RentalSteps />

      {/* 5. Cam kết chất lượng & Kêu gọi hội viên */}
      <ServiceHighlights />

      {/* Quick View Modal */}
      {quickViewCostume && (
        <CostumeDetailModal
          costume={quickViewCostume}
          onClose={() => setQuickViewCostume(null)}
        />
      )}
    </div>
  );
}
