
import { useState } from 'react';
import { paymentService } from '../features/payments/paymentService';
import { useBilling } from '../features/billing/useBilling';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createSubscription } = useBilling();

  const handleMpesaPayment = async (
    amount: number,
    phoneNumber: string,
    userId: string,
    plan: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.initiateMpesaPayment(
        userId,
        amount,
        phoneNumber,
        plan
      );
      await createSubscription(plan);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLemonSqueezyPayment = async (
    userId: string, 
    planVariantId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const checkoutUrl = await paymentService.initiateLemonSqueezyPayment(
        userId,
        planVariantId
      );
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleMpesaPayment,
    handleLemonSqueezyPayment
  };
};