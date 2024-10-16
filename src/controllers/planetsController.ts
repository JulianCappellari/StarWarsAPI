import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import { PlanetService } from '../services/planets/PlanetService';


export const getPlanets: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { name, page = 1, limit = 10 } = req.query;

  try {
    const result = await PlanetService.getPlanets({
      name: name as string,
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json(result);
  } catch (error) {
    next(error); 
  }
};
