const Costume = require('../../models/admin/costume.model');
const Size = require('../../models/admin/size.model');
const Category = require('../../models/admin/category.model');

// Helper đệ quy lấy toàn bộ ID của các danh mục con cháu
const getAllDescendantCategoryIds = (allCategories, rootId) => {
  const ids = [];
  const traverse = (parentId) => {
    allCategories.forEach((cat) => {
      if (cat.parentId && cat.parentId.toString() === parentId.toString()) {
        const cId = cat._id.toString();
        ids.push(cId);
        traverse(cId);
      }
    });
  };
  traverse(rootId);
  return ids;
};

// [GET] /client/costumes
module.exports.index = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, size, sort } = req.query;

    const find = {
      deleted: false,
      status: 'active',
    };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      find.$or = [
        { title: regex },
        { color: regex },
        { description: regex },
      ];
    }

    const categories = await Category.find({ deleted: false });

    // Hỗ trợ lọc theo danh mục bằng slug hoặc _id, bao gồm cả danh mục con cháu
    if (category && category !== 'all') {
      const targetCat = categories.find(
        (c) => c.slug === category || c._id.toString() === category
      );
      if (targetCat) {
        const descendantIds = getAllDescendantCategoryIds(categories, targetCat._id);
        const targetIds = [targetCat._id.toString(), ...descendantIds];
        find.categoryId = { $in: targetIds };
      } else {
        find.categoryId = category;
      }
    }

    if (minPrice || maxPrice) {
      find.dailyRentalPrice = {};
      if (minPrice) find.dailyRentalPrice.$gte = Number(minPrice);
      if (maxPrice) find.dailyRentalPrice.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { dailyRentalPrice: 1 };
    else if (sort === 'price-desc') sortObj = { dailyRentalPrice: -1 };
    else if (sort === 'name-asc') sortObj = { title: 1 };
    else if (sort === 'name-desc') sortObj = { title: -1 };

    const costumes = await Costume.find(find).sort(sortObj);
    const sizes = await Size.find({ deleted: false });

    const sizeMap = {};
    sizes.forEach((s) => {
      sizeMap[s._id.toString()] = s.title;
    });

    const categoryMap = {};
    const categorySlugMap = {};
    categories.forEach((c) => {
      categoryMap[c._id.toString()] = c.name;
      categorySlugMap[c._id.toString()] = c.slug;
    });

    let data = costumes.map((item) => {
      const costumeObj = item.toObject();
      const catId = costumeObj.categoryId ? costumeObj.categoryId.toString() : '';

      costumeObj.categoryName = categoryMap[catId] || 'Chưa phân loại';
      costumeObj.categorySlug = categorySlugMap[catId] || '';
      costumeObj.sizes = (costumeObj.sizes || []).map((s) => {
        const sId = s.sizeId ? s.sizeId.toString() : '';
        return {
          sizeId: sId,
          title: sizeMap[sId] || sId,
          quantity: s.quantity,
        };
      });
      return costumeObj;
    });

    // Lọc theo size nếu có yêu cầu
    if (size && size !== 'all') {
      data = data.filter((c) =>
        (c.sizes || []).some(
          (s) => s.title.toLowerCase() === size.toLowerCase() && s.quantity > 0
        )
      );
    }

    res.json({
      success: true,
      total: data.length,
      data: data,
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách trang phục client:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// [GET] /client/costumes/detail/:id or /client/costumes/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id || req.params.slugCostume;
    let costume = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      costume = await Costume.findOne({ _id: id, deleted: false });
    }
    if (!costume && id) {
      costume = await Costume.findOne({ slug: id, deleted: false });
    }

    if (!costume) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trang phục yêu cầu',
      });
    }

    const sizes = await Size.find({ deleted: false });
    const category = costume.categoryId
      ? await Category.findById(costume.categoryId)
      : null;

    const sizeMap = {};
    sizes.forEach((s) => {
      sizeMap[s._id.toString()] = s.title;
    });

    const costumeObj = costume.toObject();
    costumeObj.categoryName = category ? category.name : 'Chưa phân loại';
    costumeObj.categorySlug = category ? category.slug : '';
    costumeObj.sizes = (costumeObj.sizes || []).map((s) => {
      const sId = s.sizeId ? s.sizeId.toString() : '';
      return {
        sizeId: sId,
        title: sizeMap[sId] || sId,
        quantity: s.quantity,
      };
    });

    // Lấy thêm gợi ý trang phục liên quan cùng danh mục
    let relatedCostumes = [];
    if (costume.categoryId) {
      const related = await Costume.find({
        categoryId: costume.categoryId,
        _id: { $ne: costume._id },
        deleted: false,
        status: 'active',
      }).limit(4);

      relatedCostumes = related.map((item) => {
        const obj = item.toObject();
        obj.categoryName = category ? category.name : '';
        obj.categorySlug = category ? category.slug : '';
        return obj;
      });
    }

    res.json({
      success: true,
      data: costumeObj,
      related: relatedCostumes,
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết trang phục client:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
