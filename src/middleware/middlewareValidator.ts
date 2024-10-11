import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { RequestHandler } from 'express-serve-static-core';

export const middlewareValidator: RequestHandler[] = [
    query('page').optional().isNumeric().withMessage('Page debe ser un numero'),
    query('limit').optional().isNumeric().withMessage('Limit debe ser un numero'),
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
