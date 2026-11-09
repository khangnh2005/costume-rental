'use client';
import { useState, useEffect, useMemo, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import '@/app/css/client/costumes.css';

import CostumeCard from '../components/CostumeCard';
import CostumeFilters from '../components/CostumeFilters';
import CostumeDetailModal from '../components/CostumeDetailModal';

function CategoryContent({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [category, setCategory] = useState(null);
  const [costumes, setCostumes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Display States
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewCostume, setQuickViewCostume] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Nạp dữ liệu danh mục & trang phục
  useEffect(() => {
    // Tránh trùng lặp với các đường dẫn hệ thống
    if (['costumes', 'register', 'admin', 'api', 'favicon.ico'].includes(slug)) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        // 1. Chi tiết danh mục
        let catRes;
        try {
          catRes = await axios.get(`http://localhost:5000/client/categories/${slug}`);
        } catch {
          catRes = await axios.get(`http://127.0.0.1:5000/client/categories/${slug}`);
        }

        if (catRes.data && catRes.data.data) {
          setCategory(catRes.data.data);
        } else {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // 2. Danh sách trang phục theo danh mục (slug)
        let costumesRes;
        try {
          costumesRes = await axios.get(`http://localhost:5000/client/costumes?category=${slug}`);
        } catch {
          costumesRes = await axios.get(`http://127.0.0.1:5000/client/costumes?category=${slug}`);
        }

        if (costumesRes.data && costumesRes.data.data) {
          setCostumes(costumesRes.data.data);
        }

        // 3. Toàn bộ danh mục phục vụ bộ lọc sidebar
        let allCatsRes;
        try {
          allCatsRes = await axios.get('http://localhost:5000/client/categories');
        } catch {
          allCatsRes = await axios.get('http://127.0.0.1:5000/client/categories');
        }

        if (allCatsRes.data && allCatsRes.data.data) {
          setAllCategories(allCatsRes.data.data);
        }
      } catch (err) {
        console.error('Lỗi nạp dữ liệu danh mục:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Xử lý Lọc & Tìm kiếm
  const filteredCostumes = useMemo(() => {
    let result = [...costumes];

    // 1. Tìm theo từ khóa
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (c) =>
          (c.title || '').toLowerCase().includes(q) ||
          (c.categoryName || '').toLowerCase().includes(q) ||
          (c.color || '').toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
      );
    }

    // 2. Lọc theo khoảng giá
    if (priceRange !== 'all') {
      result = result.filter((c) => {
        const price = Number(c.dailyRentalPrice) || 0;
        if (priceRange === 'under-150') return price < 150000;
        if (priceRange === '150-250') return price >= 150000 && price <= 250000;
        if (priceRange === '250-400') return price > 250000 && price <= 400000;
        if (priceRange === 'above-400') return price > 400000;
        return true;
      });
    }

    // 3. Lọc theo size
    if (selectedSize !== 'all') {
      result = result.filter((c) => {
        return (c.sizes || []).some(
          (s) =>
            (s.title || s.sizeId || '').toLowerCase() === selectedSize.toLowerCase() &&
            Number(s.quantity) > 0
        );
      });
    }

    // 4. Lọc chỉ đồ còn hàng
    if (onlyInStock) {
      result = result.filter(
        (c) => c.status === 'active' && Number(c.quantity) > 0
      );
    }

    // 5. Sắp xếp
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (Number(a.dailyRentalPrice) || 0) - (Number(b.dailyRentalPrice) || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (Number(b.dailyRentalPrice) || 0) - (Number(a.dailyRentalPrice) || 0));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      // Mới nhất (mặc định)
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [costumes, searchTerm, priceRange, selectedSize, onlyInStock, sortBy]);

  // Reset toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setSelectedSize('all');
    setOnlyInStock(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    priceRange !== 'all' ||
    selectedSize !== 'all' ||
    onlyInStock;

  if (loading) {
    return (
      <div className="costumes-page-wrapper" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Đang nạp danh mục & trang phục...</p>
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="costumes-page-wrapper" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
          Không Tìm Thấy Danh Mục
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Đường dẫn danh mục không tồn tại hoặc đã được cập nhật lại.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/costumes" className="btn-card-rent">
            Xem Tất Cả Trang Phục
          </Link>
          <Link href="/" className="client-btn-login" style={{ padding: '12px 20px' }}>
            Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="costumes-page-wrapper">
      {/* Breadcrumb */}
      <nav className="costumes-breadcrumb">
        <Link href="/">Trang Chủ</Link>
        <span>/</span>
        <Link href="/costumes">Bộ Sưu Tập</Link>
        {category.breadcrumbs &&
          category.breadcrumbs.map((b) => (
            <span key={b.id || b.slug} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>/</span>
              <Link href={`/${b.slug}`}>{b.name}</Link>
            </span>
          ))}
        <span>/</span>
        <span>{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="costumes-page-header">
        <div style={{ width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', marginBottom: '10px' }}>
            <span>📁</span> Danh Mục Trang Phục
          </div>
          <h1 style={{ fontSize: '32px', margin: '4px 0 10px 0' }}>{category.name}</h1>
          <p style={{ maxWidth: '750px', lineHeight: '1.6', color: '#e0f2fe' }}>
            {category.description ||
              `Bộ sưu tập ${category.name} thiết kế tinh xảo, chất vải cao cấp, phù hợp chụp ảnh kỷ yếu, biểu diễn và sự kiện.`}
          </p>

          {/* Subcategories Navigation Pills */}
          {category.subCategories && category.subCategories.length > 0 && (
            <div className="category-subcategories-bar">
              <span className="category-sub-pill active">
                Tất cả {category.name}
              </span>
              {category.subCategories.map((sub) => (
                <Link
                  key={sub._id || sub.slug}
                  href={`/${sub.slug}`}
                  className="category-sub-pill"
                >
                  {sub.name} →
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="costumes-layout">
        {/* Left: Filter Sidebar */}
        <CostumeFilters
          categories={allCategories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={category.slug || category._id}
          setSelectedCategory={() => {}}
          onCategoryChange={(c) => {
            if (c === 'all') {
              router.push('/costumes');
            } else if (c.slug) {
              router.push(`/${c.slug}`);
            }
          }}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          onlyInStock={onlyInStock}
          setOnlyInStock={setOnlyInStock}
          onResetFilters={handleResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Right: Catalog Content */}
        <div className="costumes-content">
          {/* Toolbar */}
          <div className="costumes-toolbar">
            <div className="toolbar-left">
              <span className="toolbar-result-count">
                Hiển thị <strong>{filteredCostumes.length}</strong> / {costumes.length} trang phục thuộc danh mục &quot;{category.name}&quot;
              </span>
            </div>

            <div className="toolbar-right">
              {/* Sort selector */}
              <div className="toolbar-sort-group">
                <label htmlFor="sortBy">Sắp xếp:</label>
                <select
                  id="sortBy"
                  className="toolbar-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá thuê: Thấp đến Cao</option>
                  <option value="price-desc">Giá thuê: Cao đến Thấp</option>
                  <option value="name-asc">Tên trang phục: A - Z</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="toolbar-view-toggle">
                <button
                  type="button"
                  className={`toolbar-btn-view ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Dạng thẻ (Grid)"
                >
                  ⊞ Thẻ
                </button>
                <button
                  type="button"
                  className={`toolbar-btn-view ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Dạng danh sách (List)"
                >
                  ☰ Danh sách
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="active-filters-bar">
              <span style={{ fontSize: '12px', color: '#64748b' }}>Đang lọc:</span>

              {searchTerm && (
                <span className="active-filter-tag">
                  Từ khóa: &quot;{searchTerm}&quot;
                  <button type="button" onClick={() => setSearchTerm('')}>✕</button>
                </span>
              )}

              {priceRange !== 'all' && (
                <span className="active-filter-tag">
                  Mức giá
                  <button type="button" onClick={() => setPriceRange('all')}>✕</button>
                </span>
              )}

              {selectedSize !== 'all' && (
                <span className="active-filter-tag">
                  Size: {selectedSize}
                  <button type="button" onClick={() => setSelectedSize('all')}>✕</button>
                </span>
              )}

              {onlyInStock && (
                <span className="active-filter-tag">
                  Còn hàng
                  <button type="button" onClick={() => setOnlyInStock(false)}>✕</button>
                </span>
              )}

              <button
                type="button"
                className="btn-filter-reset"
                onClick={handleResetFilters}
                style={{ fontSize: '12px' }}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Costumes Grid / List */}
          {filteredCostumes.length > 0 ? (
            <div className={viewMode === 'grid' ? 'costumes-grid' : 'costumes-list'}>
              {filteredCostumes.map((costume) => (
                <CostumeCard
                  key={costume._id}
                  costume={costume}
                  onQuickView={(item) => setQuickViewCostume(item)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="costumes-empty-box">
              <div className="empty-state-icon">👘</div>
              <h3 className="empty-state-title">Chưa Có Trang Phục Phù Hợp</h3>
              <p className="empty-state-desc">
                Hiện tại chưa có mẫu trang phục nào khớp với các bộ lọc bạn đã chọn trong danh mục này.
                Bạn có thể thử xóa bớt điều kiện lọc hoặc xem tất cả trang phục.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-card-rent"
                  onClick={handleResetFilters}
                >
                  Xóa Tiêu Chí Lọc
                </button>
                <Link href="/costumes" className="client-btn-login" style={{ padding: '10px 18px' }}>
                  Xem Tất Cả Trang Phục
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default function CategoryPage({ params }) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          Đang tải danh mục trang phục...
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}
