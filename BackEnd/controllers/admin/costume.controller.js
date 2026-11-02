const Costume = require('../../models/admin/costume.model');
const Size = require('../../models/admin/size.model');
const Category = require('../../models/admin/category.model');
const { createSelectTree } = require('../../helpers/createTree');

module.exports.index = async (req, res) => {
    try {
        const costumes = await Costume.find({ deleted: false }).sort({ createdAt: -1 });
        const sizes = await Size.find({ deleted: false });
        const categories = await Category.find({ deleted: false });
        
        const sizeMap = {};
        sizes.forEach(s => {
            sizeMap[s._id.toString()] = s.title;
        });

        const categoryMap = {};
        categories.forEach(c => {
            categoryMap[c._id.toString()] = c.name;
        });

        const data = costumes.map(item => {
            const costumeObj = item.toObject();
            const catId = costumeObj.categoryId ? costumeObj.categoryId.toString() : '';
            
            costumeObj.categoryName = categoryMap[catId] || '—';
            costumeObj.sizes = (costumeObj.sizes || []).map(s => {
                const sId = s.sizeId ? s.sizeId.toString() : '';
                return {
                    sizeId: sId,
                    title: sizeMap[sId] || sId,
                    quantity: s.quantity
                };
            });
            return costumeObj;
        });

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports.create = async (req, res) => {
    try {
        const sizes = await Size.find({ deleted: false });
        const categories = await Category.find({ deleted: false });

        // Dùng helper để tạo cây danh mục phân cấp có tiền tố '-- '
        const categoryTree = createSelectTree(categories);

        res.json({
            success: true,
            data: {
                sizes,
                categories: categoryTree
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports.createPost = async (req, res) => {
    try {
        const { title, categoryId, color, dailyRentalPrice, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Tên trang phục không được để trống'
            });
        }

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn danh mục trang phục'
            });
        }

        let parsedSizes = [];
        if (req.body.sizes) {
            if (typeof req.body.sizes === 'string') {
                try {
                    parsedSizes = JSON.parse(req.body.sizes);
                } catch (e) {
                    parsedSizes = [];
                }
            } else if (Array.isArray(req.body.sizes)) {
                parsedSizes = req.body.sizes;
            }
        }

        const validSizes = parsedSizes
            .map(s => ({
                sizeId: s.sizeId ? s.sizeId.toString().trim() : '',
                quantity: Number(s.quantity) || 0
            }))
            .filter(s => s.sizeId && s.quantity > 0);

        const totalQuantity = validSizes.reduce((sum, item) => sum + item.quantity, 0);

        // Lấy danh sách nhiều ảnh từ middleware uploadFields
        let imageList = [];
        if (Array.isArray(req.body.images)) {
            imageList = req.body.images;
        } else if (req.body.image) {
            imageList = [req.body.image];
        }

        const newCostume = new Costume({
            ownerId: 'ADMIN',
            title: title.trim(),
            categoryId,
            color: color ? color.trim() : '',
            dailyRentalPrice: Number(dailyRentalPrice) || 0,
            description: description ? description.trim() : '',
            images: imageList,
            sizes: validSizes,
            quantity: totalQuantity
        });

        await newCostume.save();

        res.json({
            success: true,
            message: 'Tạo trang phục thành công',
            data: newCostume
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

        // Xóa mềm để đồng bộ toàn hệ thống
        await Costume.updateOne(
            { _id: id },
            { deleted: true }
        );

        res.json({
            success: true,
            message: 'Xóa trang phục thành công'
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
        const costume = await Costume.findOne({ _id: id, deleted: false });

        if (!costume) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy trang phục'
            });
        }

        const category = await Category.findOne({ _id: costume.categoryId });
        const sizes = await Size.find({ deleted: false });

        const sizeMap = {};
        sizes.forEach(s => {
            sizeMap[s._id.toString()] = s.title;
        });

        const costumeObj = costume.toObject();
        costumeObj.categoryName = category ? category.name : '—';
        costumeObj.sizes = (costumeObj.sizes || []).map(s => {
            const sId = s.sizeId ? s.sizeId.toString().trim() : '';
            return {
                sizeId: sId,
                title: sizeMap[sId] || sId,
                quantity: s.quantity
            };
        });

        res.json({
            success: true,
            data: costumeObj
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
        const { title, categoryId, color, dailyRentalPrice, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Tên trang phục không được để trống'
            });
        }

        const price = Number(dailyRentalPrice);
        if (!dailyRentalPrice || isNaN(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Giá thuê phải lớn hơn 0'
            });
        }

        let parsedSizes = [];
        if (req.body.sizes) {
            if (typeof req.body.sizes === 'string') {
                try {
                    parsedSizes = JSON.parse(req.body.sizes);
                } catch (e) {
                    parsedSizes = [];
                }
            } else if (Array.isArray(req.body.sizes)) {
                parsedSizes = req.body.sizes;
            }
        }

        const validSizes = parsedSizes
            .map(s => ({
                sizeId: s.sizeId ? s.sizeId.toString().trim() : '',
                quantity: Number(s.quantity) || 0
            }))
            .filter(s => s.sizeId && s.quantity > 0);

        const totalQuantity = validSizes.reduce((sum, item) => sum + item.quantity, 0);

        if (totalQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Tổng số lượng trang phục phải ít nhất từ 1 trở lên'
            });
        }

        // Lấy danh sách ảnh cũ người dùng giữ lại
        let keptImages = [];
        if (req.body.existingImages) {
            try {
                keptImages = JSON.parse(req.body.existingImages);
            } catch (e) {
                keptImages = [];
            }
        }

        // Lấy danh sách ảnh mới do middleware uploadFields đẩy lên
        const newImages = Array.isArray(req.body.images) ? req.body.images : [];

        // Hợp nhất mảng ảnh
        const finalImages = [...keptImages, ...newImages];

        const updateData = {
            title: title.trim(),
            categoryId,
            color: color ? color.trim() : '',
            dailyRentalPrice: price,
            description: description ? description.trim() : '',
            sizes: validSizes,
            quantity: totalQuantity
        };

        if (finalImages.length > 0) {
            updateData.images = finalImages;
        }

        await Costume.updateOne({ _id: id }, updateData);

        res.json({
            success: true,
            message: 'Cập nhật trang phục thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};