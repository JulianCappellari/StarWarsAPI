import axios from "axios";
import { Request, Response } from "express";
import Starships from "../models/Starships";
import { getStarships } from "../controllers/startshipsControllers";

jest.mock("../models/Starships", () => ({
  find: jest.fn(),
  insertMany: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("axios");

describe("GET /api/starships", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return starships filtered by name from the database", async () => {
    const mockStarships = [
      {
        name: "Millennium Falcon",
        model: "YT-1300",
        manufacturer: "Corellian Engineering Corporation",
      },
      {
        name: "X-wing",
        model: "T-65 X-wing",
        manufacturer: "Incom Corporation",
      },
    ];

    (Starships.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockStarships),
      }),
    });

    (Starships.countDocuments as jest.Mock).mockResolvedValue(mockStarships.length);

    const req = {
      query: { name: "Falcon", page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getStarships(req, res);

    expect(Starships.find).toHaveBeenCalledWith({
      name: new RegExp("Falcon", "i"),
    });
    expect(Starships.countDocuments).toHaveBeenCalledWith({
      name: new RegExp("Falcon", "i"),
    });
    expect(res.json).toHaveBeenCalledWith({
      total: mockStarships.length,
      currentPage: 1,
      totalPages: 1,
      data: mockStarships,
    });
  });

  it("should handle errors when fetching from the external API", async () => {
    (Starships.find as jest.Mock).mockReturnValueOnce({
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

    await getStarships(req, res);

    expect(Starships.find).toHaveBeenCalledWith({});
    expect(axios.get).toHaveBeenCalledWith("https://swapi.dev/api/starships");
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

    await getStarships(req, res);

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

    await getStarships(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid parameter: limit must be a number.",
    });
  });

  it("should return all starships if no parameters are provided", async () => {
    const mockStarships = [
      {
        name: "Millennium Falcon",
        model: "YT-1300",
        manufacturer: "Corellian Engineering Corporation",
      },
      {
        name: "X-wing",
        model: "T-65 X-wing",
        manufacturer: "Incom Corporation",
      },
    ];

    (Starships.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockStarships),
      }),
    });

    (Starships.countDocuments as jest.Mock).mockResolvedValue(mockStarships.length);

    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getStarships(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockStarships.length,
      currentPage: 1,
      totalPages: 1,
      data: mockStarships,
    });
  });

  it("should insert new starships into the database if no starships are found", async () => {
    (Starships.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockStarships = [
      {
        name: "Millennium Falcon",
        model: "YT-1300",
        manufacturer: "Corellian Engineering Corporation",
      },
      {
        name: "X-wing",
        model: "T-65 X-wing",
        manufacturer: "Incom Corporation",
      },
    ];
    
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockStarships },
    });

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getStarships(req, res);

    expect(Starships.insertMany).toHaveBeenCalledWith(mockStarships);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockStarships.length,
      currentPage: 1,
      totalPages: 1,
      data: mockStarships,
    });
  });

  it("should return 500 if inserting new starships into the database fails", async () => {
    (Starships.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockStarships = [
      {
        name: "Millennium Falcon",
        model: "YT-1300",
        manufacturer: "Corellian Engineering Corporation",
      },
      {
        name: "X-wing",
        model: "T-65 X-wing",
        manufacturer: "Incom Corporation",
      },
    ];
    
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockStarships },
    });

    
    (Starships.insertMany as jest.Mock).mockRejectedValueOnce(
      new Error("Insert error")
    );

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getStarships(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
  });
});
