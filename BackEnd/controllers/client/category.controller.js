const mongoose = require('mongoose');
const Category = require('../../models/admin/category.model');
const tree = require('../../helpers/createTree');

// [GET] /client/categories
module.exports.index = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false }).sort({ createdAt: 1 });
    const categoryTree = tree.createTree(categories);

    return res.status(200).json({
      success: true,
      data: categoryTree,
      list: categories, // danh sách phẳng tiện cho lọc
    });
  } catch (error) {
    console.error('Lỗi lấy danh mục client:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// [GET] /client/categories/:slug
module.exports.detail = async (req, res) => {
  try {
    const { slug } = req.params;
    let category = null;

    if (slug) {
      category = await Category.findOne({ slug: slug, deleted: false }).lean();
      if (!category && mongoose.Types.ObjectId.isValid(slug)) {
        category = await Category.findOne({ _id: slug, deleted: false }).lean();
      }
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục yêu cầu',
      });
    }

    // Lấy chuỗi danh mục cha (breadcrumbs)
    const breadcrumbs = [];
    let currentParentId = category.parentId;
    while (currentParentId) {
      const parent = await Category.findOne({ _id: currentParentId, deleted: false })
        .select('name slug parentId')
        .lean();
      if (parent) {
        breadcrumbs.unshift({
          id: parent._id.toString(),
          name: parent.name,
          slug: parent.slug,
        });
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }

    // Lấy các danh mục con trực tiếp
    const subCategories = await Category.find({
      parentId: category._id.toString(),
      deleted: false,
    })
      .select('name slug description')
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...category,
        breadcrumbs,
        subCategories,
      },
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết danh mục client:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
