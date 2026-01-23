import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    res.status(400).json({ message: 'Validation Error', errors: err.errors });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }

  if (err.code === 11000) {
    res.status(400).json({ message: 'Duplicate field value' });
    return;
  }

  res.status(500).json({ message: 'Something went wrong' });
};

export default errorHandler;