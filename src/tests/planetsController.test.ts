import { getPlanets } from "../controllers/planetsController";
import Planets from "../models/Planets";
import axios from "axios";
import { Request, Response } from "express";

jest.mock("../models/Planets", () => ({
  find: jest.fn(),
  insertMany: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("axios");

describe("GET /api/planets", () => {
  beforeEach(() => {
    jest.clearAllMocks();  
  });

  it("should return planets from the database with filters", async () => {
    const mockPlanets = [{ name: "Tatooine" }, { name: "Alderaan" }];

    (Planets.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockPlanets), 
      }),
    });

    (Planets.countDocuments as jest.Mock).mockResolvedValue(mockPlanets.length); 

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getPlanets(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPlanets.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPlanets,
    });
  });

  it("should handle errors when fetching from the external API", async () => {
    (Planets.find as jest.Mock).mockReturnValueOnce({
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

    await getPlanets(req, res);

    expect(Planets.find).toHaveBeenCalledWith({});
    expect(axios.get).toHaveBeenCalledWith("https://swapi.dev/api/planets/");
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

    await getPlanets(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid parameter: page must be a number.",
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

    await getPlanets(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid parameter: limit must be a number.",
    });
  });

  it("should return all planets if no parameters are provided", async () => {
    const mockPlanets = [{ name: "Tatooine" }, { name: "Alderaan" }];

    (Planets.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockPlanets),
      }),
    });

    (Planets.countDocuments as jest.Mock).mockResolvedValue(mockPlanets.length);

    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getPlanets(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPlanets.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPlanets,
    });
  });

  it("should insert new planets into the database if no planets are found", async () => {
    (Planets.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockPlanets = [{ name: "Tatooine" }, { name: "Alderaan" }];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockPlanets },
    });

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getPlanets(req, res);

    expect(Planets.insertMany).toHaveBeenCalledWith(mockPlanets);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPlanets.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPlanets,
    });
  });

  it("should return 500 if inserting new planets into the database fails", async () => {
    (Planets.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockPlanets = [{ name: "Tatooine" }, { name: "Alderaan" }];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockPlanets },
    });

    
    (Planets.insertMany as jest.Mock).mockRejectedValueOnce(new Error("Insert error"));

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getPlanets(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
  });

  it("should return planets filtered by name", async () => {
    const mockPlanets = [{ name: "Tatooine" }];

    (Planets.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockPlanets),
      }),
    });

    (Planets.countDocuments as jest.Mock).mockResolvedValue(mockPlanets.length);

    const req = {
      query: { name: "Tatooine", page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getPlanets(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPlanets.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPlanets,
    });
  });
});
