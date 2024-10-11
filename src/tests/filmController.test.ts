import { NextFunction, Request, Response } from "express";
import { getFilms } from "../controllers/filmsController";
import Films from "../models/Films";
import axios from "axios";

jest.mock("../models/Films", () => ({
  find: jest.fn(),
  insertMany: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("axios");

describe("GET /api/films", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return films from the database with filters", async () => {
    const mockFilms = [
      { title: "Return of the Jedi", episode_id: 6 },
      { title: "A New Hope", episode_id: 4 },
    ];

    (Films.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockFilms),
      }),
    });

    (Films.countDocuments as jest.Mock).mockResolvedValue(mockFilms.length);

    const req = {
      query: { title: "Return of the Jedi", page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    await getFilms(req, res, next);

    expect(Films.find).toHaveBeenCalledWith({
      title: new RegExp("Return of the Jedi", "i"),
    });
    expect(res.json).toHaveBeenCalledWith({
      total: mockFilms.length,
      currentPage: 1,
      films: mockFilms,
    });
  });

  it("should handle errors when fetching from the external API", async () => {
    (Films.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    await getFilms(req, res, next);

    expect(Films.find).toHaveBeenCalledWith({});
    expect(axios.get).toHaveBeenCalledWith("https://swapi.dev/api/films/");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "API Error" });
  });

  it("should return 400 if page is not a number", async () => {
    const req = {
      query: { page: "invalid", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    await getFilms(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Parametro invalido: page debe ser un numero.",
    });
  });

  it("should return 400 if limit is not a number", async () => {
    const req = {
      query: { page: "1", limit: "invalid" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    await getFilms(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Parametro invalido: limit debe ser un numero.",
    });
  });

  it("should return all films if no parameters are provided", async () => {
    const mockFilms = [
      { title: "Return of the Jedi", episode_id: 6 },
      { title: "A New Hope", episode_id: 4 },
    ];

    (Films.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockFilms),
      }),
    });

    (Films.countDocuments as jest.Mock).mockResolvedValue(mockFilms.length);

    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    await getFilms(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockFilms.length,
      currentPage: 1,
      films: mockFilms,
    });
  });

  it("should insert new films into the database if no films are found", async () => {
    (Films.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockFilms = [
      { title: "Return of the Jedi", episode_id: 6 },
      { title: "A New Hope", episode_id: 4 },
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockFilms },
    });

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    await getFilms(req, res, next);

    expect(Films.insertMany).toHaveBeenCalledWith(mockFilms);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockFilms.length,
      currentPage: 1,
      films: mockFilms,
    });
  });

  it("should return 500 if inserting new films into the database fails", async () => {
    (Films.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockFilms = [
      { title: "Return of the Jedi", episode_id: 6 },
      { title: "A New Hope", episode_id: 4 },
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockFilms },
    });

    (Films.insertMany as jest.Mock).mockRejectedValueOnce(
      new Error("Insert error")
    );

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    await getFilms(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
  });
});
