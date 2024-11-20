export const APP_CONSTANTS = {
  MAX_FREE_REPORTS: 10,
  SUBSCRIPTION_TIERS: {
    FREE: "free",
    BASIC: "basic",
    PREMIUM: "premium"
  },
  FEATURES: {
    FREE: [
      "Generate up to 10 reports",
      "Basic templates",
      "Email support"
    ],
    BASIC: [
      "Generate up to 100 reports",
      "Custom templates",
      "Priority support",
      "Export to PDF"
    ],
    PREMIUM: [
      "Unlimited reports",
      "All features",
      "24/7 support",
      "API access"
    ]
  },
  PRICING: {
    FREE: 0,
    BASIC: 999,
    PREMIUM: 2499
  },
  LEMON_SQUEEZY_VARIANTS: {
    BASIC: 'variant_xxxx', // Replace with your actual variant IDs
    PREMIUM: 'variant_yyyy'
  }
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  REQUIRED_FIELD: 'This field is required',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
  SUBSCRIPTION_LIMIT: 'You have reached your report card limit'
};