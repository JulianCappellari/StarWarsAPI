import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import { PeopleService } from "../services/people/PeopleService";


export const getPeople: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { name = '', page = 1, limit = 10 } = req.query;

  try {
    const result = await PeopleService.getPeople({
      name: name as string,
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json(result);
  } catch (error) {
    next(error); 
  }
};
