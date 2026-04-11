const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./src/config/db');
const algorithmRoutes = require('./src/routes/algorithms');

const app = express();

const defaultOrigins = [
  'http://localhost:5173',
  'https://algo-analyzer.vercel.app'
];

const extraOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());

app.use('/api/algorithms', algorithmRoutes);
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api', require('./src/routes/Analyzev2route'));

// Backward-compatible aliases for clients still calling root-level routes.
app.use('/algorithms', algorithmRoutes);
app.use('/', require('./src/routes/Analyzev2route'));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});