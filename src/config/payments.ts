
export const PAYMENT_CONFIG = {
  MPESA: {
    TILL_NUMBER: '7829613',
    CALLBACK_URL: '/api/mpesa/callback',
    BUSINESS_NAME: 'Vincent Oduor Odundo'
  },
  LEMON_SQUEEZY: {
    STORE_ID: process.env.VITE_LEMON_SQUEEZY_STORE_ID || '',
    API_KEY: process.env.VITE_LEMON_SQUEEZY_API_KEY || ''
  }
};