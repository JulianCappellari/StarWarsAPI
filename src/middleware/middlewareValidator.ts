import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const middlewareValidator: RequestHandler[] = [
  query('page').optional().isNumeric().withMessage('Page debe ser un número.'),
  query('limit').optional().isNumeric().withMessage('Limit debe ser un número.'),
  
  
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array().map(error => ({
          msg: error.msg,
        })),
      });
    } else {
      next(); 
    }
  },
];
