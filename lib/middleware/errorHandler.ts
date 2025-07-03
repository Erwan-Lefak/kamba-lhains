import { NextApiRequest, NextApiResponse } from 'next';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
      });

      const apiError = error as ApiError;
      if (apiError.statusCode) {
        return res.status(apiError.statusCode || 500).json({
          success: false,
          error: apiError.message,
          code: apiError.code,
        });
      }

      if (error instanceof Error) {
        // Don't expose internal error messages in production
        const message = process.env.NODE_ENV === 'production' 
          ? 'Erreur interne du serveur' 
          : error.message;

        return res.status(500).json({
          success: false,
          error: message,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  };
}

export function createApiError(message: string, statusCode: number = 500, code?: string): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}