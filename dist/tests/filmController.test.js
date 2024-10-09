"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filmsController_1 = require("../controllers/filmsController");
const Films_1 = __importDefault(require("../models/Films"));
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
describe('getFilms', () => {
    it('should return films from database when available', async () => {
        const req = {
            query: { page: '1', limit: '10' },
        };
        const res = {
            json: jest.fn(),
        };
        Films_1.default.find = jest.fn().mockResolvedValue([{ title: 'Film 1' }]);
        Films_1.default.countDocuments = jest.fn().mockResolvedValue(1);
        await (0, filmsController_1.getFilms)(req, res);
        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            currentPage: 1,
            films: [{ title: 'Film 1' }],
        });
    });
    it('should fetch films from swapi.dev and save to database when no films in DB', async () => {
        const req = {
            query: { page: '1', limit: '10' },
        };
        const res = {
            json: jest.fn(),
        };
        Films_1.default.find = jest.fn().mockResolvedValue([]);
        Films_1.default.countDocuments = jest.fn().mockResolvedValue(0);
        axios_1.default.get.mockResolvedValue({
            data: { results: [{ title: 'Film 2' }] },
        });
        await (0, filmsController_1.getFilms)(req, res);
        expect(Films_1.default.insertMany).toHaveBeenCalledWith([{ title: 'Film 2' }]);
        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            currentPage: 1,
            films: [{ title: 'Film 2' }],
        });
    });
});
