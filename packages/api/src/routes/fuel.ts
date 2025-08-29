
import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get fuel types and prices
router.get('/types', async (req: AuthenticatedRequest, res) => {
  try {
    const fuelTypes = [
      { id: 1, name: 'Gasoline', price: 200, unit: 'L', available: true },
      { id: 2, name: 'Diesel', price: 180, unit: 'L', available: true },
      { id: 3, name: 'Kerosene', price: 150, unit: 'L', available: false }
    ];

    res.json({ success: true, fuelTypes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fuel types' });
  }
});

// Create fuel order
router.post('/order', async (req: AuthenticatedRequest, res) => {
  try {
    const { fuelTypeId, quantity, deliveryAddress, deliveryTime } = req.body;
    const userId = req.user.id;

    if (!fuelTypeId || !quantity || !deliveryAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real implementation, you would save this to your orders table
    const order = {
      id: `FD${Date.now()}`,
      userId,
      fuelTypeId,
      quantity,
      deliveryAddress,
      deliveryTime,
      status: 'PENDING',
      totalAmount: quantity * 200, // Calculate based on fuel type
      createdAt: new Date()
    };

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fuel order' });
  }
});

export default router;
