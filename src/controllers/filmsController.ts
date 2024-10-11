import { Request, RequestHandler, Response } from "express";
import Films from "../models/Films";
import axios from "axios";

export const getFilms = async (req: Request, res: Response) => {
  const { title, page = 1, limit = 10 } = req.query;
  const filter = title ? { title: new RegExp(title as string, "i") } : {};

  // Validar los parámetros de paginación
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
    let films = await Films.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Si no hay películas en la base de datos, obtenerlas de la API
    if (films.length === 0) {
      const response = await axios.get("https://swapi.dev/api/films/");
      films = response.data.results;

      await Films.insertMany(films);

      films = await Films.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    }

    const total = await Films.countDocuments(filter);

    // Retornar la respuesta final
    return res.json({
      total,
      currentPage: Number(page),
      films,
    });
  } catch (error) {
    // Manejar el error y devolver respuesta
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
};
