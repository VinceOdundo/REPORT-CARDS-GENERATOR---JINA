import crypto from 'crypto';
import { getEnvironmentVariables } from '../../config/environment';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { APP_CONSTANTS } from '../../utils/constants'; // Add this line

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

export const updateSubscriptionFromWebhook = async (event: string, data: any) => {
  const userId = data.custom_data?.userId;
  if (!userId) {
    throw new Error('No user ID provided in webhook data');
  }

  const subscriptionRef = doc(db, 'subscriptions', userId);

  switch (event) {
    case 'order_created':
      // Update subscription based on the order
      await updateDoc(subscriptionRef, {
        paymentStatus: 'processing',
        orderId: data.id,
        updatedAt: new Date()
      });
      break;

    case 'order_paid':
      // Activate the subscription when payment is confirmed
      const variantId = data.attributes.variant_id;
      const plan = variantId === APP_CONSTANTS.LEMON_SQUEEZY_VARIANTS.PREMIUM ? 'premium' : 'basic';
      
      await updateDoc(subscriptionRef, {
        status: 'active',
        plan,
        paymentStatus: 'paid',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        reportCardsLimit: plan === 'premium' ? -1 : 100,
        updatedAt: new Date()
      });
      break;

    case 'subscription_payment_failed':
      await updateDoc(subscriptionRef, {
        paymentStatus: 'failed',
        updatedAt: new Date()
      });
      break;

    case 'subscription_cancelled':
      await updateDoc(subscriptionRef, {
        status: 'cancelled',
        updatedAt: new Date()
      });
      break;
  }
};

export const createLemonSqueezyCheckout = async (variantId: string, userId: string) => {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_LEMON_SQUEEZY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                userId
              }
            },
            product_options: {
              enabled_variants: [variantId]
            },
            checkout_options: {
              redirect_url: `${window.location.origin}/billing/success`,
              success_url: `${window.location.origin}/billing/thank-you`
            }
          }
        }
      })
    });

    const data = await response.json();
    return data.data.attributes.url;
  } catch (error) {
    throw new Error('Failed to create Lemon Squeezy checkout');
  }
};