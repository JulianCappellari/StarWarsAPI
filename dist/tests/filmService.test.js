"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Films_1 = __importDefault(require("../models/Films"));
const FilmService_1 = require("../services/film/FilmService");
const paginate_1 = require("../services/paginate");
jest.mock('../models/Films');
jest.mock('../services/paginate');
describe('FilmService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should fetch films without filters', async () => {
        const mockFilms = [{ title: 'A New Hope' }, { title: 'The Empire Strikes Back' }];
        const mockPaginate = {
            data: mockFilms,
            total: 2
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await FilmService_1.FilmService.getFilms({ title: '', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(Films_1.default, {}, 1, 10);
        expect(result).toEqual({
            total: 2,
            currentPage: 1,
            totalPages: 1,
            data: mockFilms
        });
    });
    it('should filter films by title', async () => {
        const mockFilms = [{ title: 'A New Hope' }];
        const mockPaginate = {
            data: mockFilms,
            total: 1
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await FilmService_1.FilmService.getFilms({ title: 'A New Hope', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(Films_1.default, { title: /A New Hope/i }, 1, 10);
        expect(result).toEqual({
            total: 1,
            currentPage: 1,
            totalPages: 1,
            data: mockFilms
        });
    });
    it('should handle errors in fetching films', async () => {
        paginate_1.paginate.mockRejectedValue(new Error('Database error'));
        await expect(FilmService_1.FilmService.getFilms({ title: '', page: 1, limit: 10 })).rejects.toThrow('Error fetching films: Database error');
    });
});
