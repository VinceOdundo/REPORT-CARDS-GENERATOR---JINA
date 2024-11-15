export const APP_CONSTANTS = {
  MAX_FREE_REPORTS: 40,
  SUBSCRIPTION_TIERS: {
    FREE: 'free',
    BASIC: 'basic',
    PREMIUM: 'premium'
  },
  PAYMENT_CURRENCIES: {
    KES: 'KES',
    USD: 'USD',
    NGN: 'NGN',
    GHS: 'GHS'
  },
  REPORT_CARD_TEMPLATES: {
    BASIC: 'basic',
    MODERN: 'modern',
    PREMIUM: 'premium'
  },
  FILE_TYPES: {
    PDF: 'application/pdf',
    CSV: 'text/csv'
  }
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  REQUIRED_FIELD: 'This field is required',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
  SUBSCRIPTION_LIMIT: 'You have reached your report card limit'
};