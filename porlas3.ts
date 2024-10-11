import { getPeople } from "../controllers/peopleController"; 
import People from "../models/People"; 
import axios from "axios"; 
import { Request, Response } from "express"; 

jest.mock("../models/People", () => ({
  find: jest.fn(),
  skip: jest.fn(),
  limit: jest.fn(),
  insertMany: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("axios");

describe("GET /api/people", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return people from the database", async () => {
    jest.setTimeout(10000);

    (People.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([
          { name: "Luke Skywalker", height: "172", mass: "77" },
          { name: "Darth Vader", height: "202", mass: "136" },
        ]),
      }),
    });

    (People.countDocuments as jest.Mock).mockResolvedValue(2);

    // Crea un objeto `req` que extiende `Request`
    const req = {
      query: { page: "1", limit: "10" },
      // Puedes agregar propiedades que necesites aquí si es necesario
    } as unknown as Request; // Usa `unknown` antes de `Request`

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getPeople(req, res);

    expect(People.find).toHaveBeenCalledWith({});
    expect(People.countDocuments).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: [
        { name: "Luke Skywalker", height: "172", mass: "77" },
        { name: "Darth Vader", height: "202", mass: "136" },
      ],
    });
  });

  it("should fetch people from the external API if not found in the database", async () => {
    jest.setTimeout(10000);

    (People.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        results: [
          { name: "Leia Organa", height: "150", mass: "49" },
          { name: "Han Solo", height: "180", mass: "80" },
        ],
      },
    });

    (People.insertMany as jest.Mock).mockResolvedValue(undefined);

    (People.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([
          { name: "Leia Organa", height: "150", mass: "49" },
          { name: "Han Solo", height: "180", mass: "80" },
        ]),
      }),
    });

    (People.countDocuments as jest.Mock).mockResolvedValue(2);

    const req = {
      query: { page: "1", limit: "10" },
      // Puedes agregar propiedades que necesites aquí si es necesario
    } as unknown as Request; // Usa `unknown` antes de `Request`

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getPeople(req, res);

    expect(People.find).toHaveBeenCalledWith({});
    expect(axios.get).toHaveBeenCalledWith("https://swapi.dev/api/people");
    expect(People.insertMany).toHaveBeenCalledWith([
      { name: "Leia Organa", height: "150", mass: "49" },
      { name: "Han Solo", height: "180", mass: "80" },
    ]);
    expect(People.countDocuments).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: [
        { name: "Leia Organa", height: "150", mass: "49" },
        { name: "Han Solo", height: "180", mass: "80" },
      ],
    });
  });
});
