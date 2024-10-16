"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlanetService_1 = require("../services/planets/PlanetService");
const Planets_1 = __importDefault(require("../models/Planets"));
const paginate_1 = require("../services/paginate");
jest.mock('../models/Planets');
jest.mock('../services/paginate');
describe('PlanetService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should fetch planets without filters', async () => {
        const mockPlanets = [{ name: 'Tatooine' }, { name: 'Alderaan' }];
        const mockPaginate = {
            data: mockPlanets,
            total: 2
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await PlanetService_1.PlanetService.getPlanets({ name: '', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(Planets_1.default, {}, 1, 10);
        expect(result).toEqual({
            total: 2,
            currentPage: 1,
            totalPages: 1,
            data: mockPlanets
        });
    });
    it('should filter planets by name', async () => {
        const mockPlanets = [{ name: 'Tatooine' }];
        const mockPaginate = {
            data: mockPlanets,
            total: 1
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await PlanetService_1.PlanetService.getPlanets({ name: 'Tatooine', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(Planets_1.default, { name: /Tatooine/i }, 1, 10);
        expect(result).toEqual({
            total: 1,
            currentPage: 1,
            totalPages: 1,
            data: mockPlanets
        });
    });
    it('should handle errors in fetching planets', async () => {
        paginate_1.paginate.mockRejectedValue(new Error('Database error'));
        await expect(PlanetService_1.PlanetService.getPlanets({ name: '', page: 1, limit: 10 })).rejects.toThrow('Error fetching planets: Database error');
    });
});
