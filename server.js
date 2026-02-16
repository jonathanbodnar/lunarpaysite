const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Lead capture proxy — forwards to app.lunarpay.com to avoid CORS
app.post('/api/leads', async (req, res) => {
  try {
    const response = await fetch('https://app.lunarpay.com/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Lead capture error:', err);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// FOMO social proof widget data — proxies from app.lunarpay.com
app.get('/api/fomo', async (req, res) => {
  try {
    const response = await fetch('https://app.lunarpay.com/api/public/fomo');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ names: [] });
  }
});

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve specific HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/terms.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});

app.get('/privacy.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

