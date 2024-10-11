import { Request, Response } from "express";
import Planets from "../models/Planets";
import axios from "axios";

export const getPlanets = async (req: Request, res: Response) => {
  const { name, page = 1, limit = 10 } = req.query;

  if (page && isNaN(Number(page))) {
    return res.status(400).json({ error: "Invalid parameter: page must be a number." });
  }
  if (limit && isNaN(Number(limit))) {
    return res.status(400).json({ error: "Invalid parameter: limit must be a number." });
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
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
};
