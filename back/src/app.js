const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Eclipsefy Dashboard API is running' });
});

module.exports = app;
