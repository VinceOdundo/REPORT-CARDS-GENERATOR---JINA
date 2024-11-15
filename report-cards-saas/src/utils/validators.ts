export const validators = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password: string): boolean => {
    return password.length >= 8;
  },

  phone: (phone: string): boolean => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
  },

  score: (score: number): boolean => {
    return score >= 0 && score <= 100;
  },

  required: <T>(value: T | null | undefined): value is T => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  }
};