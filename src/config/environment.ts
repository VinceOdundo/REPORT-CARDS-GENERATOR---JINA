/// <reference types="vite/client" />

export interface Environment {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
  API_URL: string;
  STRIPE_PUBLIC_KEY: string;
  LEMON_SQUEEZY_WEBHOOK_SECRET: string;
  MPESA_CONSUMER_KEY: string;
  MPESA_CONSUMER_SECRET: string;
  MPESA_BUSINESS_SHORT_CODE: string;
  MPESA_PASSKEY: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

export const getEnvironmentVariables = (): Environment => {
  return {
    FIREBASE_API_KEY: import.meta.env.VITE_API_KEY,
    FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: import.meta.env.VITE_APP_ID,
    FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID,
    API_URL: import.meta.env.VITE_API_URL,
    STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    LEMON_SQUEEZY_WEBHOOK_SECRET: import.meta.env.VITE_LEMON_SQUEEZY_WEBHOOK_SECRET,
    MPESA_CONSUMER_KEY: import.meta.env.VITE_MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET: import.meta.env.VITE_MPESA_CONSUMER_SECRET,
    MPESA_BUSINESS_SHORT_CODE: import.meta.env.VITE_MPESA_BUSINESS_SHORT_CODE,
    MPESA_PASSKEY: import.meta.env.VITE_MPESA_PASSKEY,
    NODE_ENV: import.meta.env.MODE as 'development' | 'production' | 'test'
  };
};