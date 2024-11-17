export class AnalyticsError extends Error {
    constructor(
      message: string,
      public readonly code: string,
      public readonly metadata?: Record<string, any>
    ) {
      super(message);
      this.name = 'AnalyticsError';
    }
  }
  
  export const analyticsErrorHandler = {
    handleAnalyticsError(error: unknown): AnalyticsError {
      if (error instanceof AnalyticsError) {
        return error;
      }
  
      if (error instanceof Error) {
        return new AnalyticsError(
          error.message,
          'ANALYTICS_ERROR',
          { originalError: error }
        );
      }
  
      return new AnalyticsError(
        'An unexpected error occurred while processing analytics',
        'UNKNOWN_ERROR'
      );
    }
  };