import { Request, Response } from "express";
import Planets from "../models/Planets";
import axios from "axios";

export const getPlanets = async (req: Request, res: Response) => {
  const { name, page = 1, limit = 10 } = req.query;
  const filter = name ? { name: new RegExp(name as string, "i") } : {};

  let people = await Planets.find(filter)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  if (people.length === 0) {
    const response = await axios.get("https://swapi.dev/api/planets/");
    people = response.data.results;

    await Planets.insertMany(people);

    people = await Planets.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
  }

  const total = await Planets.countDocuments(filter);

  res.json({
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: people,
  });
};
