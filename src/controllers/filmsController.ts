import { NextFunction, Request, RequestHandler, Response } from "express";
import Films from "../models/Films";
import axios from "axios";
import { FilmService } from "../services/film/FilmService";

export const getFilms: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, page = 1, limit = 10 } = req.query;
  try {
    const result = await FilmService.getFilms({
      title: title as string,
      page: Number(page),
      limit: Number(limit),
    })
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
