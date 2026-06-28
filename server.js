const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'freelancehq-secret';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.redirect('/login');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.redirect('/login');
  }
};

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/dashboard', authenticate, (req, res) => res.render('dashboard', { user: { name: 'John' } }));

app.post('/api/login', (req, res) => {
  const token = jwt.sign({ id: 1, name: 'John Smith' }, JWT_SECRET);
  res.json({ success: true, token });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));