const { uploadImage } = require('../../helpers/uploadToCloudinary');

module.exports.uploadSingle = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const link = await uploadImage(req.file.buffer);
        req.body[req.file.fieldname] = link;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi tải ảnh lên Cloudinary: ' + error.message
        });
    }
};