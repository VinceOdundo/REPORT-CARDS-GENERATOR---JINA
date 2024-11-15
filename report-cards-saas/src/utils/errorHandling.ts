import { FirebaseError } from 'firebase/app';

export class AppError extends Error {
  public code: string;
  public retry?: () => Promise<void>;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

export const handleFirebaseError = (error: FirebaseError): AppError => {
  const errorMessages: Record<string, string> = {
    'permission-denied': 'You don\'t have permission to perform this action',
    'not-found': 'The requested resource was not found',
    'already-exists': 'This resource already exists'
  };

  return new AppError(
    errorMessages[error.code] || 'An unexpected error occurred',
    error.code
  );
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError!;
};