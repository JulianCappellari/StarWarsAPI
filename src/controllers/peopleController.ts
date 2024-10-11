import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express"; // Ajustado para usar el tipo correcto
import People from "../models/People";
import axios from "axios";

export const getPeople: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, page = 1, limit = 10 } = req.query;
  const filter = name ? { name: new RegExp(name as string, "i") } : {};


  if (page && isNaN(Number(page))) {
    res.status(400).json({ error: "Parametro invalido: page debe ser un numero." });
    return; 
  }
  if (limit && isNaN(Number(limit))) {
    res.status(400).json({ error: "Parametro invalido: limit debe ser un numero." });
    return; 
  }

  try {
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
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
};
