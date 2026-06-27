import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example API endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'THE AID 2 TIMES Backend',
    version: '1.0.0',
    status: 'running'
  });
});

// Auth routes (placeholder)
app.post('/api/auth/login', (req, res) => {
  // TODO: Implement backend auth logic here
  res.json({ message: 'Login endpoint - to be implemented' });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - to be implemented' });
});

// Resources routes (placeholder)
app.get('/api/resources', (req, res) => {
  // TODO: Fetch resources from Supabase DB
  res.json({ resources: [] });
});

app.post('/api/resources', (req, res) => {
  // TODO: Create new resource
  res.json({ message: 'Create resource endpoint - to be implemented' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});
