export class RetryableError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'RetryableError';
    }
  }
  
  export const withRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (!(error instanceof RetryableError) || attempt === maxRetries) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
    
    throw lastError;
  };
  
  export const isRetryableError = (error: any): boolean => {
    if (error instanceof RetryableError) return true;
    
    // Add specific Firebase error codes that should be retried
    const retryableCodes = [
      'permission-denied',
      'unavailable',
      'deadline-exceeded',
      'cancelled'
    ];
    
    return retryableCodes.includes(error.code);
  };