import { NextFunction, Request, RequestHandler, Response } from "express";
import Planets from "../models/Planets";
import axios from "axios";

export const getPlanets: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, page = 1, limit = 10 } = req.query;

  if (page && isNaN(Number(page))) {
    res.status(400).json({ error: "Parametro invalido: page debe ser un numero." });
    return; 
  }
  if (limit && isNaN(Number(limit))) {
    res.status(400).json({ error: "Parametro invalido: limit debe ser un numero." });
    return; 
  }

  const filter = name ? { name: new RegExp(name as string, "i") } : {};

  try {
    let planets = await Planets.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    if (planets.length === 0) {
      const response = await axios.get("https://swapi.dev/api/planets/");
      planets = response.data.results;

      await Planets.insertMany(planets);

      planets = await Planets.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    }

    const total = await Planets.countDocuments(filter);

     res.json({
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: planets,
    });
  } catch (error) {
     res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
};
