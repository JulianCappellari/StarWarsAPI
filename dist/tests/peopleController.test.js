"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peopleController_1 = require("../controllers/peopleController");
const People_1 = __importDefault(require("../models/People"));
const axios_1 = __importDefault(require("axios"));
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
        People_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockPeople),
            }),
        });
        People_1.default.countDocuments.mockResolvedValue(mockPeople.length);
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, peopleController_1.getPeople)(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockPeople.length,
            currentPage: 1,
            totalPages: 1,
            data: mockPeople,
        });
    });
    it("should handle errors when fetching from the external API", async () => {
        People_1.default.find.mockReturnValueOnce({
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
        await (0, peopleController_1.getPeople)(req, res);
        expect(People_1.default.find).toHaveBeenCalledWith({});
        expect(axios_1.default.get).toHaveBeenCalledWith("https://swapi.dev/api/people");
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
        await (0, peopleController_1.getPeople)(req, res);
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
        await (0, peopleController_1.getPeople)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid parameter: limit must be a number.",
        });
    });
    it("should return all people if no parameters are provided", async () => {
        const mockPeople = [{ name: "Luke Skywalker" }, { name: "Darth Vader" }];
        People_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockPeople),
            }),
        });
        People_1.default.countDocuments.mockResolvedValue(mockPeople.length);
        const req = {
            query: {},
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, peopleController_1.getPeople)(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockPeople.length,
            currentPage: 1,
            totalPages: 1,
            data: mockPeople,
        });
    });
    it("should insert new people into the database if no people are found", async () => {
        People_1.default.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([]),
            }),
        });
        const mockPeople = [{ name: "Luke Skywalker" }, { name: "Darth Vader" }];
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockPeople },
        });
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, peopleController_1.getPeople)(req, res);
        expect(People_1.default.insertMany).toHaveBeenCalledWith(mockPeople);
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
        People_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(mockPeople),
            }),
        });
        People_1.default.countDocuments.mockResolvedValue(mockPeople.length);
        const req = {
            query: { name: "Luke", page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, peopleController_1.getPeople)(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: mockPeople.length,
            currentPage: 1,
            totalPages: 1,
            data: mockPeople,
        });
    });
    it("should return 500 if inserting new people into the database fails", async () => {
        People_1.default.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([]),
            }),
        });
        const mockPeople = [{ name: "Luke Skywalker" }, { name: "Darth Vader" }];
        axios_1.default.get.mockResolvedValueOnce({
            data: { results: mockPeople },
        });
        People_1.default.insertMany.mockRejectedValueOnce(new Error("Insert error"));
        const req = {
            query: { page: "1", limit: "10" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        await (0, peopleController_1.getPeople)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Insert error" });
    });
});
