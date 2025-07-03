import { NextApiRequest, NextApiResponse } from 'next';
import { ZodSchema, ZodError } from 'zod';

export interface ValidatedRequest<T = any> extends NextApiRequest {
  validatedData: T;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (handler: (req: ValidatedRequest<T>, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const validatedData = schema.parse(req.body);
        (req as ValidatedRequest<T>).validatedData = validatedData;
        return handler(req as ValidatedRequest<T>, res);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Données invalides',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          });
        }
        return res.status(500).json({
          success: false,
          error: 'Erreur de validation interne',
        });
      }
    };
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (handler: (req: ValidatedRequest<T>, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const validatedData = schema.parse(req.query);
        (req as ValidatedRequest<T>).validatedData = validatedData;
        return handler(req as ValidatedRequest<T>, res);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Paramètres de requête invalides',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          });
        }
        return res.status(500).json({
          success: false,
          error: 'Erreur de validation interne',
        });
      }
    };
  };
}