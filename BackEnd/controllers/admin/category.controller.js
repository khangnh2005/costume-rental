const Category = require('../../models/admin/category.model')

exports.index = async(req,res)=>{
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      data: categories,
    });
}

module.exports.createPost = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Tên danh mục không được để trống'
            });
        }

        const newCategory = new Category({
            name: name.trim(),
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
        const id = req.params.id;
        const category = await Category.findOne({ _id: id, deleted: false });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        await Category.updateOne(
            { _id: id },
            { 
                deleted: true,
                deletedAt: new Date()
            }
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
        const id = req.params.id;
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Tên danh mục không được để trống'
            });
        }

        await Category.updateOne(
            { _id: id },
            {
                name: name.trim(),
                description: description ? description.trim() : ''
            }
        );

        res.json({
            success: true,
            message: 'Cập nhật danh mục thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};