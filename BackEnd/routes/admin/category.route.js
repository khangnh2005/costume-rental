const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/category.controller');

// [GET] /admin/categories
router.get('/', categoryController.index);
router.post('/create', categoryController.createPost);
router.get('/detail/:id', categoryController.detail);
router.patch('/edit/:id', categoryController.editPatch);
router.patch('/delete/:id', categoryController.deleteItem);
module.exports = router;