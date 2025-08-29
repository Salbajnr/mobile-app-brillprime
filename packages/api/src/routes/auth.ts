
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser, registerUser } from '@brillprime/shared';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authenticateUser(email, password);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.user.id, email: result.user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: result.user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const result = await registerUser({
      email,
      password,
      fullName,
      phone,
      role: role || 'CONSUMER'
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.user.id, email: result.user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      user: result.user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Token refresh endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Generate new token
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
