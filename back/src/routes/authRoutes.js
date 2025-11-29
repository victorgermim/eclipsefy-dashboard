const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/login', authController.login);
router.post('/register', authMiddleware, adminMiddleware, authController.register);

module.exports = router;
