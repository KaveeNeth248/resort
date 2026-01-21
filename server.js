const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simple in-memory user database (for testing)
const users = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({
      message: 'Login Successful',
      username: username
    });
  } else {
    res.status(401).json({
      message: 'Invalid Credentials'
    });
  }
});

// Dashboard endpoint (mock data)
app.get('/api/dashboard', (req, res) => {
  res.json({
    totalRooms: 50,
    occupiedRooms: 32,
    availableRooms: 18,
    revenue: '$45,230',
  });
});

// Rooms endpoint
app.get('/api/rooms', (req, res) => {
  res.json([
    { id: 1, number: '101', type: 'Standard', status: 'occupied', price: '$120' },
    { id: 2, number: '102', type: 'Deluxe', status: 'available', price: '$180' },
    { id: 3, number: '201', type: 'Suite', status: 'occupied', price: '$250' },
    { id: 4, number: '202', type: 'Standard', status: 'available', price: '$120' },
  ]);
});

// Reservations endpoint
app.get('/api/reservations', (req, res) => {
  res.json([
    { id: 1, guest: 'John Doe', room: '101', checkIn: '2026-01-25', checkOut: '2026-01-28' },
    { id: 2, guest: 'Jane Smith', room: '201', checkIn: '2026-01-26', checkOut: '2026-01-30' },
  ]);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🏨 Resort Backend Server running on http://localhost:${PORT}`);
});
