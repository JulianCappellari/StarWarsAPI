"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filmsController_1 = require("../controllers/filmsController");
const Films_1 = __importDefault(require("../models/Films"));
const axios_1 = __importDefault(require("axios"));
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
        Films_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockFilms),
            }),
        });
        Films_1.default.countDocuments.mockResolvedValue(mockFilms.length);
        const req = {
            query: { title: "Return of the Jedi", page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        await (0, filmsController_1.getFilms)(req, res, next);
        expect(Films_1.default.find).toHaveBeenCalledWith({
            title: new RegExp("Return of the Jedi", "i"),
        });
        expect(res.json).toHaveBeenCalledWith({
            total: mockFilms.length,
            currentPage: 1,
            films: mockFilms,
        });
    });
    it("should handle errors when fetching from the external API", async () => {
        Films_1.default.find.mockReturnValueOnce({
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
        const next = jest.fn();
        await (0, filmsController_1.getFilms)(req, res, next);
        expect(Films_1.default.find).toHaveBeenCalledWith({});
        expect(axios_1.default.get).toHaveBeenCalledWith("https://swapi.dev/api/films/");
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
        const next = jest.fn();
        await (0, filmsController_1.getFilms)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Parametro invalido: page debe ser un numero.",
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
        const next = jest.fn();
        await (0, filmsController_1.getFilms)(req, res, next);
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
        Films_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockFilms),
            }),
        });
        Films_1.default.countDocuments.mockResolvedValue(mockFilms.length);
        const req = {
            query: {},
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        await (0, filmsController_1.getFilms)(req, res, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockFilms.length,
            currentPage: 1,
            films: mockFilms,
        });
    });
    it("should insert new films into the database if no films are found", async () => {
        Films_1.default.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([]),
            }),
        });
        const mockFilms = [
            { title: "Return of the Jedi", episode_id: 6 },
            { title: "A New Hope", episode_id: 4 },
        ];
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockFilms },
        });
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        await (0, filmsController_1.getFilms)(req, res, next);
        expect(Films_1.default.insertMany).toHaveBeenCalledWith(mockFilms);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockFilms.length,
            currentPage: 1,
            films: mockFilms,
        });
    });
    it("should return 500 if inserting new films into the database fails", async () => {
        Films_1.default.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([]),
            }),
        });
        const mockFilms = [
            { title: "Return of the Jedi", episode_id: 6 },
            { title: "A New Hope", episode_id: 4 },
        ];
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockFilms },
        });
        Films_1.default.insertMany.mockRejectedValueOnce(new Error("Insert error"));
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        await (0, filmsController_1.getFilms)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
    });
});
