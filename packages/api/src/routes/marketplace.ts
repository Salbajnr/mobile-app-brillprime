
import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get marketplace products
router.get('/products', async (req: AuthenticatedRequest, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    // Mock data - replace with actual database queries
    const products = [
      {
        id: 1,
        name: 'Fresh Groceries',
        description: 'Fresh fruits and vegetables from local farmers',
        price: 2500,
        category: 'Groceries',
        merchantId: 1,
        merchantName: 'Fresh Market',
        imageUrl: 'https://picsum.photos/300/200?random=1',
        inStock: true
      },
      {
        id: 2,
        name: 'Electronics Bundle',
        description: 'Quality electronics and accessories',
        price: 15000,
        category: 'Electronics',
        merchantId: 2,
        merchantName: 'Tech Store',
        imageUrl: 'https://picsum.photos/300/200?random=2',
        inStock: true
      },
      {
        id: 3,
        name: 'Home Essentials',
        description: 'Daily household items and cleaning supplies',
        price: 5000,
        category: 'Home',
        merchantId: 3,
        merchantName: 'Home Depot',
        imageUrl: 'https://picsum.photos/300/200?random=3',
        inStock: true
      }
    ];

    res.json({ success: true, products, totalPages: 1, currentPage: 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product details
router.get('/products/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Mock product details
    const product = {
      id: parseInt(id),
      name: 'Fresh Groceries',
      description: 'Fresh fruits and vegetables from local farmers',
      price: 2500,
      category: 'Groceries',
      merchantId: 1,
      merchantName: 'Fresh Market',
      imageUrl: 'https://picsum.photos/300/200?random=1',
      inStock: true,
      rating: 4.5,
      reviews: 123
    };

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

export default router;
