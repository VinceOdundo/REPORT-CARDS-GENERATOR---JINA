
import crypto from 'crypto';
import { getEnvironmentVariables } from '../../config/environment';

const env = getEnvironmentVariables();

export const verifyLemonSqueezyWebhook = (
  payload: any,
  signature: string
): boolean => {
  const hmac = crypto.createHmac('sha256', env.LEMON_SQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
};

export const updateSubscriptionFromWebhook = async (
  event: string,
  data: any
) => {
  // Handle different webhook events and update subscription accordingly
  // Implementation depends on your specific needs
};