import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';


dotenv.config();
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err.stack);
  }
  res.status(500).json({
      message: err.message || "Error interno del servidor",
  });
};

