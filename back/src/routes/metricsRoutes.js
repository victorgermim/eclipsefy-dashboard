const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/:userId', authMiddleware, adminMiddleware, metricsController.addMetrics);
router.get('/my-metrics', authMiddleware, metricsController.getClientMetrics);

module.exports = router;
