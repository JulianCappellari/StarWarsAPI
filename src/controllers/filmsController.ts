import { Request, Response } from "express";
import Films from "../models/Films";
import axios from "axios";

export const getFilms = async (req: Request, res: Response) => {
  const { title, page = 1, limit = 10 } = req.query;
  const filter = title ? { title: new RegExp(title as string, "i") } : {};

  if (page && isNaN(Number(page))) {
    return res
      .status(400)
      .json({ error: "Invalid parameter: page must be a number." });
  }
  if (limit && isNaN(Number(limit))) {
    return res
      .status(400)
      .json({ error: "Invalid parameter: limit must be a number." });
  }

  try {
    let film = await Films.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    if (film.length === 0) {
      const response = await axios.get("https://swapi.dev/api/films/");
      film = response.data.results;

      await Films.insertMany(film);

      film = await Films.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    }

    const total = await Films.countDocuments(filter);

    res.json({
      total,
      currentPage: Number(page),
      films: film,
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
};
