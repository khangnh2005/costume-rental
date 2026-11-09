const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/client/category.controller');

router.get('/', categoryController.index);
router.get('/:slug', categoryController.detail);

module.exports = router;
