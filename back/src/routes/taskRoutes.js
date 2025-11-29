const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../config/multer');

router.post('/', authMiddleware, adminMiddleware, upload.single('media'), taskController.createTask);
router.get('/', authMiddleware, taskController.getTasks);
router.patch('/:id/approve', authMiddleware, taskController.approveTask);

module.exports = router;
