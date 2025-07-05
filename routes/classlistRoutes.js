const express = require('express');
const router = express.Router();
const classlistController = require('../controllers/classlistController');

router.get('/getClasses', classlistController.getClasses);

module.exports = router;