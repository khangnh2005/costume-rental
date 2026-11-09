const express = require('express');
const router = express.Router();
const costumeController = require('../../controllers/client/costume.controller');

router.get('/', costumeController.index);
router.get('/detail/:id', costumeController.detail);
router.get('/:id', costumeController.detail);

module.exports = router;
