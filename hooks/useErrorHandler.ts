import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  code?: string;
  timestamp: Date;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: Error | string, code?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    setError({
      message: errorMessage,
      code,
      timestamp: new Date(),
    });
    
    // Log error for debugging
    console.error('Error occurred:', {
      message: errorMessage,
      code,
      timestamp: new Date(),
      stack: typeof error === 'object' ? error.stack : undefined,
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      errorMessage?: string
    ): Promise<T | null> => {
      try {
        setIsLoading(true);
        clearError();
        const result = await asyncFunction();
        return result;
      } catch (err) {
        const message = errorMessage || 'Une erreur inattendue s\'est produite';
        handleError(err instanceof Error ? err : new Error(message));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, clearError]
  );

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  };
};