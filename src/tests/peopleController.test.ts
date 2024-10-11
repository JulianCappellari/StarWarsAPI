import { getPeople } from "../controllers/peopleController";
import People from "../models/People";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

jest.mock("../models/People", () => ({
  find: jest.fn(),
  insertMany: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("axios");

describe("GET /api/people", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should return people from the database with filters", async () => {
    const mockPeople = [{ name: "Luke Skywalker" }, { name: "Darth Vader" }];

    (People.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockPeople), 
      }),
    });

    (People.countDocuments as jest.Mock).mockResolvedValue(mockPeople.length);

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn(); 

    await getPeople(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPeople.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPeople,
    });
  });

  it("should handle errors when fetching from the external API", async () => {
    (People.find as jest.Mock).mockReturnValueOnce({
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

    await getPeople(req, res, next);

    expect(People.find).toHaveBeenCalledWith({});
    expect(axios.get).toHaveBeenCalledWith("https://swapi.dev/api/people");
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

    await getPeople(req, res, next);

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

    await getPeople(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Parametro invalido: limit debe ser un numero.",
    });
  });

  it("should return all people if no parameters are provided", async () => {
    const mockPeople = [{ name: "Luke Skywalker" }, { name: "Darth Vader" }];

    (People.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockPeople),
      }),
    });

    (People.countDocuments as jest.Mock).mockResolvedValue(mockPeople.length);

    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn(); 

    await getPeople(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPeople.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPeople,
    });
  });

  it("should insert new people into the database if no people are found", async () => {
    (People.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockPeople = [{ name: "Luke Skywalker" }, { name: "Darth Vader" }];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockPeople },
    });

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn(); 

    await getPeople(req, res, next);

    expect(People.insertMany).toHaveBeenCalledWith(mockPeople);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPeople.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPeople,
    });
  });

  it("should return people filtered by name", async () => {
    const mockPeople = [{ name: "Luke Skywalker" }];

    (People.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockPeople),
      }),
    });

    (People.countDocuments as jest.Mock).mockResolvedValue(mockPeople.length);

    const req = {
      query: { name: "Luke", page: "1", limit: "10" },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next: NextFunction = jest.fn(); 

    await getPeople(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      total: mockPeople.length,
      currentPage: 1,
      totalPages: 1,
      data: mockPeople,
    });
  });

  it("should return 500 if inserting new people into the database fails", async () => {
    (People.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const mockPeople = [{ name: "Luke Skywalker" }, { name: "Darth Vader" }];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockPeople },
    });

    (People.insertMany as jest.Mock).mockRejectedValueOnce(
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

    await getPeople(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
  });
});
