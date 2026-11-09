'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import '@/app/css/client/costumes.css';

import CostumeCard from '../components/CostumeCard';
import CostumeFilters from '../components/CostumeFilters';
import CostumeDetailModal from '../components/CostumeDetailModal';

function CostumesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'all';

  const [costumes, setCostumes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [priceRange, setPriceRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Display States
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewCostume, setQuickViewCostume] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Tự động chuyển hướng từ route cũ /costumes?category=... sang /[slug]
  useEffect(() => {
    if (urlCategory && urlCategory !== 'all' && categories.length > 0) {
      const flat = [];
      categories.forEach((cat) => {
        flat.push(cat);
        if (cat.children && cat.children.length > 0) {
          cat.children.forEach((c) => flat.push(c));
        }
      });
      const matched = flat.find((c) => c._id === urlCategory || c.slug === urlCategory);
      if (matched && matched.slug) {
        router.replace(`/${matched.slug}`);
      } else if (!urlCategory.match(/^[0-9a-fA-F]{24}$/)) {
        router.replace(`/${urlCategory}`);
      }
    }
  }, [urlCategory, categories, router]);

  // Đồng bộ searchParams từ URL nếu URL thay đổi
  useEffect(() => {
    if (urlSearch) setSearchTerm(urlSearch);
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  // Nạp dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        let costumesRes;
        try {
          costumesRes = await axios.get('http://127.0.0.1:5000/client/costumes');
        } catch {
          costumesRes = await axios.get('http://localhost:5000/admin/costumes');
        }
        if (costumesRes.data && costumesRes.data.data) {
          setCostumes(costumesRes.data.data);
        }

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
        console.error('Lỗi nạp danh sách trang phục:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

    // 2. Lọc theo danh mục
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((c) => {
        const catId = c.categoryId ? c.categoryId.toString() : '';
        const catSlug = c.categorySlug || '';
        const catName = (c.categoryName || '').toLowerCase();
        const target = selectedCategory.toLowerCase();

        return (
          catId === selectedCategory ||
          catSlug === selectedCategory ||
          catName.includes(target)
        );
      });
    }

    // 3. Lọc theo khoảng giá
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

    // 4. Lọc theo size
    if (selectedSize !== 'all') {
      result = result.filter((c) => {
        return (c.sizes || []).some(
          (s) =>
            (s.title || s.sizeId || '').toLowerCase() === selectedSize.toLowerCase() &&
            Number(s.quantity) > 0
        );
      });
    }

    // 5. Lọc chỉ đồ còn hàng
    if (onlyInStock) {
      result = result.filter(
        (c) => c.status === 'active' && Number(c.quantity) > 0
      );
    }

    // 6. Sắp xếp
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
  }, [costumes, searchTerm, selectedCategory, priceRange, selectedSize, onlyInStock, sortBy]);

  // Reset toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSelectedSize('all');
    setOnlyInStock(false);
    setSortBy('newest');
  };

  // Kiểm tra xem có bộ lọc nào đang bật không
  const hasActiveFilters =
    searchTerm !== '' ||
    (selectedCategory !== 'all' && selectedCategory !== '') ||
    priceRange !== 'all' ||
    selectedSize !== 'all' ||
    onlyInStock;

  return (
    <div className="costumes-page-wrapper">
      {/* Breadcrumb */}
      <nav className="costumes-breadcrumb">
        <Link href="/">Trang Chủ</Link>
        <span>/</span>
        <span>Bộ Sưu Tập Trang Phục</span>
      </nav>

      {/* Page Header */}
      <div className="costumes-page-header">
        <div>
          <h1>Bộ Sưu Tập Trang Phục Cho Thuê</h1>
          <p>
            Tìm kiếm mẫu trang phục biểu diễn, kỷ yếu và dự tiệc phù hợp nhất.
            Lọc dễ dàng theo danh mục, mức giá và kích thước.
          </p>
        </div>
        <button
          type="button"
          className="btn-toggle-mobile-filter"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          ⚙️ {isMobileFilterOpen ? 'Đóng Bộ Lọc' : 'Mở Bộ Lọc'}
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="costumes-layout">
        {/* Left: Filter Sidebar */}
        <CostumeFilters
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onCategoryChange={(c) => {
            if (c === 'all') {
              setSelectedCategory('all');
            } else if (c.slug) {
              router.push(`/${c.slug}`);
            } else if (c.id) {
              setSelectedCategory(c.id);
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
                Hiển thị <strong>{filteredCostumes.length}</strong> / {costumes.length} trang phục
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

              {selectedCategory && selectedCategory !== 'all' && (
                <span className="active-filter-tag">
                  Danh mục
                  <button type="button" onClick={() => setSelectedCategory('all')}>✕</button>
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              Đang tải danh sách trang phục...
            </div>
          ) : filteredCostumes.length > 0 ? (
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
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">Không Tìm Thấy Trang Phục Phù Hợp</h3>
              <p className="empty-state-desc">
                Rất tiếc, hiện tại không có mẫu trang phục nào khớp với tất cả các tiêu chí bạn vừa chọn.
                Bạn có thể thử tìm từ khóa khác hoặc xóa bớt các điều kiện lọc.
              </p>
              <button
                type="button"
                className="btn-card-rent"
                onClick={handleResetFilters}
              >
                Xóa Tất Cả Tiêu Chí Lọc
              </button>
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

export default function CostumesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Đang tải danh sách trang phục...</div>}>
      <CostumesContent />
    </Suspense>
  );
}
