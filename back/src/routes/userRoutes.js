const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, adminMiddleware, userController.listUsers);
router.post('/', authMiddleware, adminMiddleware, userController.createClient); // New route
router.patch('/:id/services', authMiddleware, adminMiddleware, userController.updateUserServices);
router.post('/:id/send-access', authMiddleware, adminMiddleware, userController.sendAccess); // New route

module.exports = router;
