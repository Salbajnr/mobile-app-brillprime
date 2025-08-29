
import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get user's orders
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    // Mock orders data
    const orders = [
      {
        id: 'FD001',
        type: 'FUEL_DELIVERY',
        status: 'IN_TRANSIT',
        totalAmount: 4000,
        items: [{ name: 'Gasoline', quantity: 20, unit: 'L' }],
        deliveryAddress: '123 Lagos Street, Lagos',
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: 'MP002',
        type: 'MARKETPLACE',
        status: 'DELIVERED',
        totalAmount: 2500,
        items: [{ name: 'Fresh Groceries', quantity: 1 }],
        deliveryAddress: '123 Lagos Street, Lagos',
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    res.json({ success: true, orders, totalPages: 1, currentPage: 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Mock order details
    const order = {
      id,
      userId,
      type: 'FUEL_DELIVERY',
      status: 'IN_TRANSIT',
      totalAmount: 4000,
      items: [{ name: 'Gasoline', quantity: 20, unit: 'L', price: 200 }],
      deliveryAddress: '123 Lagos Street, Lagos',
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
      trackingInfo: {
        driverName: 'John Driver',
        driverPhone: '+234901234567',
        vehicleNumber: 'ABC123XY',
        currentLocation: 'En route to delivery location'
      },
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    };

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

export default router;
