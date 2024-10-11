import { NextFunction, Request, RequestHandler, Response } from "express";
import axios from "axios";
import Starships from "../models/Starships";

export const getStarship: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, page = 1, limit = 10 } = req.query;

  if (page && isNaN(Number(page))) {
    res.status(400).json({ error: "Parametro invalido: page debe ser un numero." });
    return; 
  }
  if (limit && isNaN(Number(limit))) {
    res.status(400).json({ error: "Parametro invalido: limit debe ser un numero." });
    return; 
  }

  try {
    const filter = name ? { name: new RegExp(name as string, "i") } : {};

    let starships = await Starships.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    if (starships.length === 0) {
      const response = await axios.get("https://swapi.dev/api/starships");
      starships = response.data.results;

      await Starships.insertMany(starships);

      starships = await Starships.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    }

    const total = await Starships.countDocuments(filter);

     res.json({
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: starships,
    });
  } catch (error) {
     res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
};
