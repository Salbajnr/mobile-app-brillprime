
import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Process QR code scan for toll payment
router.post('/scan', async (req: AuthenticatedRequest, res) => {
  try {
    const { qrData } = req.body;
    const userId = req.user.id;

    if (!qrData) {
      return res.status(400).json({ error: 'QR code data is required' });
    }

    // Parse QR code data (in real implementation, validate the QR code)
    const tollInfo = {
      tollGateId: 'TG001',
      tollGateName: 'Lagos-Ibadan Expressway Toll',
      amount: 500,
      location: 'Lagos State'
    };

    res.json({ success: true, tollInfo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process QR code' });
  }
});

// Process toll payment
router.post('/pay', async (req: AuthenticatedRequest, res) => {
  try {
    const { tollGateId, amount, paymentMethodId } = req.body;
    const userId = req.user.id;

    if (!tollGateId || !amount || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing required payment information' });
    }

    // In real implementation, process payment and save transaction
    const transaction = {
      id: `TXN${Date.now()}`,
      userId,
      tollGateId,
      amount,
      status: 'COMPLETED',
      transactionRef: `REF${Date.now()}`,
      createdAt: new Date()
    };

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

export default router;
