require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const adapter = new FileSync(path.join(__dirname, 'data', 'db.json'));
const db = low(adapter);
db.defaults({ users: [], lastId: 0 }).write();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

function createToken(user){
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function authMiddleware(req, res, next){
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ ok:false, message:'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    next();
  } catch (e) {
    return res.status(401).json({ ok:false, message:'Invalid token' });
  }
}

// Register
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ ok:false, message:'Email and password required' });
  if (password.length < 6) return res.status(400).json({ ok:false, message:'Password must be at least 6 characters' });

  const existing = (db.data.users || []).find(u => u.email === email);
  if (existing) return res.status(409).json({ ok:false, message:'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const id = ++db.data.lastId;
  const user = { id, email, password_hash: hash, name: name || null, created_at: new Date().toISOString() };
  db.data.users.push(user);
  await db.write();
  const publicUser = { id: user.id, email: user.email, name: user.name };
  const token = createToken(user);
  res.json({ ok:true, user, token });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok:false, message:'Email and password required' });

  const user = (db.data.users || []).find(u => u.email === email);
  if (!user) return res.status(401).json({ ok:false, message:'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ ok:false, message:'Invalid credentials' });

  const token = createToken(user);
  res.json({ ok:true, user:{ id:user.id, email:user.email, name:user.name }, token });
});

// Get current user
app.get('/api/me', authMiddleware, (req, res) => {
  const user = (db.data.users || []).find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ ok:false, message:'User not found' });
  res.json({ ok:true, user:{ id:user.id, email:user.email, name:user.name, created_at:user.created_at } });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

