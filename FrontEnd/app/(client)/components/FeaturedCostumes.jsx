'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import CostumeCard from './CostumeCard';

export default function FeaturedCostumes({ costumes = [], categories = [], onQuickView }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Xây dựng danh sách tabs bộ lọc danh mục
  const categoryTabs = useMemo(() => {
    const tabs = [{ _id: 'all', name: 'Tất cả trang phục', icon: '✨' }];

    const getIcon = (name = '') => {
      const l = name.toLowerCase();
      if (l.includes('áo dài') || l.includes('truyền thống')) return '👘';
      if (l.includes('bà ba')) return '🌾';
      if (l.includes('hiện đại') || l.includes('váy') || l.includes('dạ hội')) return '👗';
      if (l.includes('nhảy') || l.includes('disco') || l.includes('biểu diễn')) return '🕺';
      if (l.includes('cổ phục')) return '👑';
      return '🎭';
    };

    categories.slice(0, 6).forEach((cat) => {
      tabs.push({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        icon: getIcon(cat.name),
      });
    });

    return tabs;
  }, [categories]);

  // Lọc trang phục theo tab đã chọn và giới hạn 8 mẫu
  const displayCostumes = useMemo(() => {
    if (selectedCategory === 'all') {
      return costumes.slice(0, 8);
    }

    const filtered = costumes.filter((c) => {
      const catId = c.categoryId ? c.categoryId.toString() : '';
      const catSlug = c.categorySlug || '';
      return catId === selectedCategory || catSlug === selectedCategory;
    });

    return filtered.slice(0, 8);
  }, [costumes, selectedCategory]);

  return (
    <section className="client-section client-section-alt client-featured-section">
      <div className="client-section-container">
        {/* Section Header */}
        <div className="client-section-header">
          <div className="client-section-badge">
            <span>✨</span> BỘ SƯU TẬP TIÊU BIỂU
          </div>
          <h2 className="client-section-title">Trang Phục Mới Nhất & Được Yêu Thích</h2>
          <p className="client-section-desc">
            Khám phá những thiết kế trang phục biểu diễn, sự kiện và chụp ảnh hot trend.
            Trang phục được giặt ủi sạch sẽ, thơm tho và sẵn sàng phục vụ bạn mọi lúc.
          </p>

          {/* Interactive Category Filter Tabs on Home */}
          {categoryTabs.length > 1 && (
            <div className="client-category-tabs-wrapper">
              <div className="client-category-tabs">
                {categoryTabs.map((tab) => {
                  const isActive = selectedCategory === tab._id;
                  return (
                    <button
                      key={tab._id}
                      type="button"
                      className={`client-category-tab-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(tab._id)}
                    >
                      <span className="tab-icon">{tab.icon}</span>
                      <span className="tab-name">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Costumes Grid */}
        {displayCostumes.length > 0 ? (
          <div className="client-featured-grid">
            {displayCostumes.map((costume) => (
              <CostumeCard
                key={costume._id}
                costume={costume}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="client-featured-empty">
            <div className="empty-icon">🎭</div>
            <h3>Chưa có trang phục trong mục này</h3>
            <p>Vui lòng chọn danh mục khác hoặc bấm xem tất cả trang phục.</p>
            <button
              type="button"
              className="client-btn-reset-tab"
              onClick={() => setSelectedCategory('all')}
            >
              Quay lại tất cả
            </button>
          </div>
        )}

        {/* Bottom CTA Action */}
        <div className="client-section-actions-center">
          <Link href="/costumes" className="client-btn-view-all">
            <span>Xem Tất Cả {costumes.length > 0 ? `${costumes.length}+` : ''} Trang Phục</span>
            <span className="btn-arrow-icon">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
