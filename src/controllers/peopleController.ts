import { Request, Response } from "express";
import People from "../models/People";
import axios from "axios";
import { Types } from "mongoose";

export const getPeople = async (req: Request, res: Response) => {
  const { name, page = 1, limit = 10 } = req.query;
  const filter = name ? { name: new RegExp(name as string, "i") } : {};

  let people = await People.find(filter)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  if (people.length === 0) {
    const response = await axios.get("https://swapi.dev/api/people");
    people = response.data.results;

    await People.insertMany(people);

    people = await People.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
  }

  const total = await People.countDocuments(filter);

  res.json({
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: people,
  });
};
