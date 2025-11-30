const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, adminMiddleware, userController.listUsers);
router.patch('/:id/services', authMiddleware, adminMiddleware, userController.updateUserServices);

module.exports = router;
