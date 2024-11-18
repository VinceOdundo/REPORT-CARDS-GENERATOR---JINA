
import express from 'express';
import { verifyLemonSqueezyWebhook } from '../services/lemonSqueezyService';

const router = express.Router();

router.post('/webhook', async (req, res) => {
  try {
    const signature = Array.isArray(req.headers['x-signature']) ? req.headers['x-signature'][0] : req.headers['x-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'No signature provided' });
    }

    const isValid = verifyLemonSqueezyWebhook(req.body, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;
    switch (event) {
      case 'order_created':
        // Handle new order
        break;
      case 'subscription_created':
        // Handle new subscription
        break;
      case 'subscription_updated':
        // Handle subscription update
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.json({ received: true });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;