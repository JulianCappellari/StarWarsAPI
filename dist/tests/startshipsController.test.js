"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Starships_1 = __importDefault(require("../models/Starships"));
const startshipsControllers_1 = require("../controllers/startshipsControllers");
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
        Starships_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockStarships),
            }),
        });
        Starships_1.default.countDocuments.mockResolvedValue(mockStarships.length);
        const req = {
            query: { name: "Falcon", page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, startshipsControllers_1.getStarships)(req, res);
        expect(Starships_1.default.find).toHaveBeenCalledWith({
            name: new RegExp("Falcon", "i"),
        });
        expect(Starships_1.default.countDocuments).toHaveBeenCalledWith({
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
        Starships_1.default.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([]),
            }),
        });
        axios_1.default.get.mockRejectedValueOnce(new Error("API Error"));
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, startshipsControllers_1.getStarships)(req, res);
        expect(Starships_1.default.find).toHaveBeenCalledWith({});
        expect(axios_1.default.get).toHaveBeenCalledWith("https://swapi.dev/api/starships");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "API Error" });
    });
    it("should return 400 if page is not a number", async () => {
        const req = {
            query: { page: "invalid", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, startshipsControllers_1.getStarships)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid parameter: page must be a number.",
        });
    });
    it("should return 400 if limit is not a number", async () => {
        const req = {
            query: { page: "1", limit: "invalid" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, startshipsControllers_1.getStarships)(req, res);
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
        Starships_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockStarships),
            }),
        });
        Starships_1.default.countDocuments.mockResolvedValue(mockStarships.length);
        const req = {
            query: {},
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, startshipsControllers_1.getStarships)(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockStarships.length,
            currentPage: 1,
            totalPages: 1,
            data: mockStarships,
        });
    });
    it("should insert new starships into the database if no starships are found", async () => {
        Starships_1.default.find.mockReturnValueOnce({
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
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockStarships },
        });
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, startshipsControllers_1.getStarships)(req, res);
        expect(Starships_1.default.insertMany).toHaveBeenCalledWith(mockStarships);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockStarships.length,
            currentPage: 1,
            totalPages: 1,
            data: mockStarships,
        });
    });
    it("should return 500 if inserting new starships into the database fails", async () => {
        Starships_1.default.find.mockReturnValueOnce({
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
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockStarships },
        });
        Starships_1.default.insertMany.mockRejectedValueOnce(new Error("Insert error"));
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, startshipsControllers_1.getStarships)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
    });
});
