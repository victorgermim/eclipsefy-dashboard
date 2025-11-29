const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const metricsRoutes = require('./metricsRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/metrics', metricsRoutes);
router.use('/tasks', taskRoutes);

router.get('/status', (req, res) => {
    res.json({ status: 'API is operational' });
});

module.exports = router;
