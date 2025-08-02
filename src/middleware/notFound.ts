import { Request, Response } from 'express';
import { NotFoundError } from '../exception/AppError';

export const notFound = (req: Request, res: Response): void => {
    throw new NotFoundError(`Route ${req.originalUrl} not found`);
}; 