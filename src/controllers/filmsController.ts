import { NextFunction, Request, RequestHandler, Response } from "express";
import Films from "../models/Films";
import axios from "axios";

export const getFilms: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, page = 1, limit = 10 } = req.query;
  const filter = title ? { title: new RegExp(title as string, "i") } : {};

  if (page && isNaN(Number(page))) {
    res.status(400).json({ error: "Parametro invalido: page debe ser un numero." });
    return; 
  }
  if (limit && isNaN(Number(limit))) {
    res.status(400).json({ error: "Parametro invalido: limit debe ser un numero." });
    return; 
  }
  try {
    let films = await Films.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    if (films.length === 0) {
      const response = await axios.get("https://swapi.dev/api/films/");
      films = response.data.results;

      await Films.insertMany(films);

      films = await Films.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    }

    const total = await Films.countDocuments(filter);

    res.json({
      total,
      currentPage: Number(page),
      films,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
  }
};
