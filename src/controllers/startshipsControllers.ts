import { Request, Response } from "express";
import Starships from "../models/Startships";
import axios from "axios";

export const getStarships = async (req: Request, res: Response) => {
  const { name, page = 1, limit = 10 } = req.query;
  const filter = name ? { name: new RegExp(name as string, "i") } : {};

  let starships = await Starships.find(filter)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  if (starships.length === 0) {
    const response = await axios.get("https://swapi.dev/api/starships");
    starships = response.data.results;

    await Starships.insertMany(Starships);

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
};
