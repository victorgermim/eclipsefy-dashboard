const express = require('express');
const router = express.Router();

// Import other routes here
// const userRoutes = require('./userRoutes');
// router.use('/users', userRoutes);

router.get('/status', (req, res) => {
    res.json({ status: 'API is operational' });
});

module.exports = router;
