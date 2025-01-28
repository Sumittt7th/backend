
// rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 100, 
  message: {
    status: 429,
    message: "Too many requests. Please try again after 5 minutes.",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    res.status(options.statusCode).json({
      status: options.statusCode,
      message: "Too many requests. Please try again after 5 minutes.",
    });
  },
  skipFailedRequests: false, 
  skipSuccessfulRequests: false, 
  keyGenerator: (req: Request): string => req.ip as string, 
});

export default limiter;