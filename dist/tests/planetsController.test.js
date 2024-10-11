"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const planetsController_1 = require("../controllers/planetsController");
const Planets_1 = __importDefault(require("../models/Planets"));
const axios_1 = __importDefault(require("axios"));
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
        Planets_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockPlanets),
            }),
        });
        Planets_1.default.countDocuments.mockResolvedValue(mockPlanets.length);
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, planetsController_1.getPlanets)(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockPlanets.length,
            currentPage: 1,
            totalPages: 1,
            data: mockPlanets,
        });
    });
    it("should handle errors when fetching from the external API", async () => {
        Planets_1.default.find.mockReturnValueOnce({
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
        await (0, planetsController_1.getPlanets)(req, res);
        expect(Planets_1.default.find).toHaveBeenCalledWith({});
        expect(axios_1.default.get).toHaveBeenCalledWith("https://swapi.dev/api/planets/");
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
        await (0, planetsController_1.getPlanets)(req, res);
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
        await (0, planetsController_1.getPlanets)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid parameter: limit must be a number.",
        });
    });
    it("should return all planets if no parameters are provided", async () => {
        const mockPlanets = [{ name: "Tatooine" }, { name: "Alderaan" }];
        Planets_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockPlanets),
            }),
        });
        Planets_1.default.countDocuments.mockResolvedValue(mockPlanets.length);
        const req = {
            query: {},
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, planetsController_1.getPlanets)(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockPlanets.length,
            currentPage: 1,
            totalPages: 1,
            data: mockPlanets,
        });
    });
    it("should insert new planets into the database if no planets are found", async () => {
        Planets_1.default.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([]),
            }),
        });
        const mockPlanets = [{ name: "Tatooine" }, { name: "Alderaan" }];
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockPlanets },
        });
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, planetsController_1.getPlanets)(req, res);
        expect(Planets_1.default.insertMany).toHaveBeenCalledWith(mockPlanets);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockPlanets.length,
            currentPage: 1,
            totalPages: 1,
            data: mockPlanets,
        });
    });
    it("should return 500 if inserting new planets into the database fails", async () => {
        Planets_1.default.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([]),
            }),
        });
        const mockPlanets = [{ name: "Tatooine" }, { name: "Alderaan" }];
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockPlanets },
        });
        Planets_1.default.insertMany.mockRejectedValueOnce(new Error("Insert error"));
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, planetsController_1.getPlanets)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
    });
    it("should return planets filtered by name", async () => {
        const mockPlanets = [{ name: "Tatooine" }];
        Planets_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockPlanets),
            }),
        });
        Planets_1.default.countDocuments.mockResolvedValue(mockPlanets.length);
        const req = {
            query: { name: "Tatooine", page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, planetsController_1.getPlanets)(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockPlanets.length,
            currentPage: 1,
            totalPages: 1,
            data: mockPlanets,
        });
    });
});
