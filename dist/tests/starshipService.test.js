"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StarshipService_1 = require("../services/starships/StarshipService");
const Starships_1 = __importDefault(require("../models/Starships"));
const paginate_1 = require("../services/paginate");
jest.mock('../models/Starships', () => {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
    };
});
jest.mock('../services/paginate');
describe('StarshipService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should fetch starships without filters', async () => {
        const mockStarships = [{ name: 'Millennium Falcon' }, { name: 'X-wing' }];
        const mockPaginate = {
            data: mockStarships,
            total: 2,
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await StarshipService_1.StarshipService.getStarships({ name: '', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(Starships_1.default, {}, 1, 10);
        expect(result).toEqual({
            total: 2,
            currentPage: 1,
            totalPages: 1,
            data: mockStarships,
        });
    });
    it('should filter starships by name', async () => {
        const mockStarships = [{ name: 'Millennium Falcon' }];
        const mockPaginate = {
            data: mockStarships,
            total: 1,
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await StarshipService_1.StarshipService.getStarships({ name: 'Millennium Falcon', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(Starships_1.default, { name: /Millennium Falcon/i }, 1, 10);
        expect(result).toEqual({
            total: 1,
            currentPage: 1,
            totalPages: 1,
            data: mockStarships,
        });
    });
    it('should handle errors in fetching starships', async () => {
        paginate_1.paginate.mockRejectedValue(new Error('Database error'));
        await expect(StarshipService_1.StarshipService.getStarships({ name: '', page: 1, limit: 10 })).rejects.toThrow('Error fetching starships: Database error');
    });
});
