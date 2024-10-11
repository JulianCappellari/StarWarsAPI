import { Request, Response } from "express";
import axios from "axios";
import Starships from "../models/Starships";

export const getStarships = async (req: Request, res: Response) => {
  const { name, page = 1, limit = 10 } = req.query;

  if (page && isNaN(Number(page))) {
    return res.status(400).json({ error: "Invalid parameter: page must be a number." });
  }
  if (limit && isNaN(Number(limit))) {
    return res.status(400).json({ error: "Invalid parameter: limit must be a number." });
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
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
};
