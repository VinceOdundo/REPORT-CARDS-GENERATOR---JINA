import express from 'express';
import { verifyLemonSqueezyWebhook, updateSubscriptionFromWebhook } from '../services/lemonSqueezyService';

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
    const supportedEvents = [
      'order_created',
      'order_paid',
      'subscription_created',
      'subscription_updated',
      'subscription_payment_failed',
      'subscription_cancelled'
    ];

    if (supportedEvents.includes(event)) {
      await updateSubscriptionFromWebhook(event, data);
    } else {
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