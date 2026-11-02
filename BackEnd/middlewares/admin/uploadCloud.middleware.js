const uploadHelper = require('../../helpers/uploadToCloudinary'); 

// Middleware upload 1 ảnh lẻ (giữ lại để các chức năng cũ không bị ảnh hưởng)
module.exports.uploadSingle = async (req, res, next) => {
    try {
        if (req.file) {
            const url = await uploadHelper.uploadImage(req.file.buffer);
            req.body[req.file.fieldname] = url;
        }
        next();
    } catch (error) {
        console.error('Lỗi upload ảnh đơn:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi tải ảnh lên Cloudinary'
        });
    }
};

// Middleware upload nhiều ảnh (cho yêu cầu upload nhiều ảnh)
module.exports.uploadFields = async (req, res, next) => {
    try {
        // Trường hợp 1: Dùng multer.array('images') -> file nằm trong req.files (dạng Array)
        if (Array.isArray(req.files) && req.files.length > 0) {
            req.body.images = [];
            for (const file of req.files) {
                const url = await uploadHelper.uploadImage(file.buffer);
                req.body.images.push(url);
            }
        } 
        // Trường hợp 2: Dùng multer.fields([{ name: 'images', maxCount: 6 }]) -> file nằm trong req.files['images']
        else if (req.files && typeof req.files === 'object') {
            for (const key of Object.keys(req.files)) {
                req.body[key] = [];
                for (const file of req.files[key]) {
                    const url = await uploadHelper.uploadImage(file.buffer);
                    req.body[key].push(url);
                }
            }
        }

        next();
    } catch (error) {
        console.error('Lỗi upload nhiều ảnh:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi tải danh sách ảnh lên Cloudinary'
        });
    }
};