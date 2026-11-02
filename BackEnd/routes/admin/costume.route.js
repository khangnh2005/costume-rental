const express = require('express');
const router = express.Router();
const costumeController = require('../../controllers/admin/costume.controller');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get('/', costumeController.index);
router.get('/create', costumeController.create);

// Đổi upload.single('image') thành upload.array('images', 6) và dùng uploadFields
router.post(
    '/create',
    upload.array('images', 6),
    uploadCloud.uploadFields,
    costumeController.createPost
);

router.get('/detail/:id', costumeController.detail);

router.patch(
    '/edit/:id',
    upload.array('images', 6),
    uploadCloud.uploadFields,
    costumeController.editPatch
);

router.patch('/delete/:id', costumeController.deleteItem);

module.exports = router;