'use client';

export default function CostumeFilters({
  categories = [],
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onCategoryChange,
  priceRange,
  setPriceRange,
  selectedSize,
  setSelectedSize,
  onlyInStock,
  setOnlyInStock,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
}) {
  const priceOptions = [
    { label: 'Tất cả mức giá', value: 'all' },
    { label: 'Dưới 150.000 đ', value: 'under-150' },
    { label: '150.000 đ - 250.000 đ', value: '150-250' },
    { label: '250.000 đ - 400.000 đ', value: '250-400' },
    { label: 'Trên 400.000 đ', value: 'above-400' },
  ];

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  // Biến mảng phẳng các danh mục
  const flatCategories = [];
  categories.forEach((cat) => {
    flatCategories.push({ id: cat._id, name: cat.name, slug: cat.slug });
    if (cat.children && cat.children.length > 0) {
      cat.children.forEach((child) => {
        flatCategories.push({
          id: child._id,
          name: `— ${child.name}`,
          slug: child.slug,
        });
      });
    }
  });

  return (
    <aside className={`costumes-filter-sidebar ${isOpenMobile ? 'open-mobile' : ''}`}>
      {/* Header */}
      <div className="filter-sidebar-header">
        <h3>
          <span>⚙️</span> Bộ Lọc Trang Phục
        </h3>
        <button
          type="button"
          className="btn-filter-reset"
          onClick={onResetFilters}
          title="Xóa toàn bộ tiêu chí lọc"
        >
          Đặt lại ↺
        </button>
      </div>

      {/* 1. Keyword Search */}
      <div className="filter-group">
        <label className="filter-group-title">
          <span>Tìm kiếm</span>
        </label>
        <div className="filter-search-box">
          <span className="filter-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tên, màu sắc, loại đồ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Category Filter */}
      <div className="filter-group">
        <div className="filter-group-title">
          <span>Danh Mục</span>
        </div>
        <ul className="filter-category-list">
          <li className="filter-category-item">
            <label
              className={`filter-category-label ${
                selectedCategory === 'all' || !selectedCategory ? 'active' : ''
              }`}
              onClick={() => {
                if (onCategoryChange) {
                  onCategoryChange('all');
                } else if (setSelectedCategory) {
                  setSelectedCategory('all');
                }
              }}
            >
              <span>Tất cả danh mục</span>
            </label>
          </li>
          {flatCategories.map((c) => (
            <li key={c.id} className="filter-category-item">
              <label
                className={`filter-category-label ${
                  selectedCategory === c.id || selectedCategory === c.slug ? 'active' : ''
                }`}
                onClick={() => {
                  if (onCategoryChange) {
                    onCategoryChange(c);
                  } else if (setSelectedCategory) {
                    setSelectedCategory(c.id);
                  }
                }}
              >
                <span>{c.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Price Filter */}
      <div className="filter-group">
        <div className="filter-group-title">
          <span>Khoảng Giá Thuê (Ngày)</span>
        </div>
        <div className="filter-price-options">
          {priceOptions.map((opt) => (
            <label key={opt.value} className="filter-price-label">
              <input
                type="radio"
                name="priceFilter"
                checked={priceRange === opt.value}
                onChange={() => setPriceRange(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Size Filter */}
      <div className="filter-group">
        <div className="filter-group-title">
          <span>Kích Cỡ (Size)</span>
        </div>
        <div className="filter-sizes-grid">
          <button
            type="button"
            className={`filter-size-btn ${selectedSize === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedSize('all')}
          >
            Tất cả
          </button>
          {sizeOptions.map((sz) => (
            <button
              key={sz}
              type="button"
              className={`filter-size-btn ${selectedSize === sz ? 'active' : sz}`}
              onClick={() => setSelectedSize(selectedSize === sz ? 'all' : sz)}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Stock Status */}
      <div className="filter-group">
        <div className="filter-group-title">
          <span>Tình Trạng</span>
        </div>
        <label className="filter-stock-label">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
          />
          <span>Chỉ hiện trang phục sẵn có</span>
        </label>
      </div>
    </aside>
  );
}
