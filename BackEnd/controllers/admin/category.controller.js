const Category = require('../../models/admin/category.model')
const tree = require('../../helpers/createTree')
exports.index = async(req,res)=>{
    try {
        const categories = await Category.find({ deleted: false }).sort({ createdAt: -1 });
        const categoryTree = tree.createTree(categories);

        return res.status(200).json({
            success: true,
            data: categoryTree,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
   
}

module.exports.create = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false });
    // Danh sách đã định dạng "-- Tên" để nạp vào thẻ <select> chọn cha
    const selectTree = tree.createSelectTree(categories);

    res.json({
      success: true,
      data: selectTree
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.createPost = async (req, res) => {
    try {
        const { name, parentId, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Tên danh mục không được để trống'
            });
        }

        const newCategory = new Category({
            name: name.trim(),
            parentId: (parentId && parentId.trim() !== '') ? parentId.trim() : null,
            description: description ? description.trim() : ''
        });

        await newCategory.save();

        res.json({
            success: true,
            message: 'Tạo danh mục thành công',
            data: newCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id, deleted: { $ne: true } }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    let parentCategory = null;
    if (category.parentId) {
      parentCategory = await Category.findOne({
        _id: category.parentId,
        deleted: { $ne: true }
      }).select('name slug').lean();
    }

    return res.status(200).json({
      success: true,
      data: {
        ...category,
        parentName: parentCategory ? parentCategory.name : 'Danh mục gốc (Cấp 1)'
      }
    });
  } catch (error) {
    console.error('Lỗi tại detail category:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi lấy thông tin chi tiết danh mục'
    });
  }
};

module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        await Category.deleteOne(
            { _id: id }
        );

        res.json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports.editPatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục không được để trống'
      });
    }

    // Không cho phép danh mục chọn chính nó làm danh mục cha
    if (parentId && String(parentId) === String(id)) {
      return res.status(400).json({
        success: false,
        message: 'Không thể chọn chính danh mục này làm danh mục cha'
      });
    }

    const updateData = {
      name: name.trim(),
      parentId: (parentId && parentId.trim() !== '') ? parentId.trim() : null,
      description: description ? description.trim() : ''
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục để cập nhật'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Lỗi editPatch category:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server khi cập nhật danh mục'
    });
  }
};