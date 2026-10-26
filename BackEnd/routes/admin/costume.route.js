const express = require('express');
const router = express.Router();
const costumeController = require('../../controllers/admin/costume.controller');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get('/', costumeController.index);
router.get('/create', costumeController.create);
router.post('/create',
    upload.single('image'),
    uploadCloud.uploadSingle, 
    costumeController.createPost
);
router.get('/detail/:id', costumeController.detail);
router.patch(
    '/edit/:id',
    upload.single('image'),
    uploadCloud.uploadSingle,
    costumeController.editPatch
);
router.patch('/delete/:id', costumeController.deleteItem);

module.exports = router;