
import express from 'express';
import { getUserById, updateUser } from '@brillprime/shared';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone } = req.body;

    const updatedUser = await updateUser(userId, {
      fullName,
      phone
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;
