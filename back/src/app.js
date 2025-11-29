const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Eclipsefy Dashboard API is running' });
});

module.exports = app;
