
import express from 'express';
import { initializeMpesa } from '../services/mpesaService';

const router = express.Router();

router.post('/stkPush', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
    const response = await initializeMpesa({
      phoneNumber,
      amount,
      accountReference,
      transactionDesc
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    // Handle M-Pesa callback
    // Update subscription status
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;