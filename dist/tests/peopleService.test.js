"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PeopleService_1 = require("../services/people/PeopleService");
const People_1 = __importDefault(require("../models/People"));
const paginate_1 = require("../services/paginate");
jest.mock('../models/People');
jest.mock('../services/paginate');
describe('PeopleService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('debería obtener personas sin filtros', async () => {
        const mockPeople = [{ name: 'Luke Skywalker' }, { name: 'Leia Organa' }];
        const mockPaginate = {
            data: mockPeople,
            total: 2
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await PeopleService_1.PeopleService.getPeople({ name: '', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(People_1.default, {}, 1, 10);
        expect(result).toEqual({
            total: 2,
            currentPage: 1,
            totalPages: 1,
            data: mockPeople
        });
    });
    it('debería filtrar personas por nombre', async () => {
        const mockPeople = [{ name: 'Luke Skywalker' }];
        const mockPaginate = {
            data: mockPeople,
            total: 1
        };
        paginate_1.paginate.mockResolvedValue(mockPaginate);
        const result = await PeopleService_1.PeopleService.getPeople({ name: 'Luke', page: 1, limit: 10 });
        expect(paginate_1.paginate).toHaveBeenCalledWith(People_1.default, { name: /Luke/i }, 1, 10);
        expect(result).toEqual({
            total: 1,
            currentPage: 1,
            totalPages: 1,
            data: mockPeople
        });
    });
    it('debería manejar errores al obtener personas', async () => {
        paginate_1.paginate.mockRejectedValue(new Error('Error de la base de datos'));
        await expect(PeopleService_1.PeopleService.getPeople({ name: '', page: 1, limit: 10 })).rejects.toThrow('Error fetching people: Error de la base de datos');
    });
});
