"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const dbConfig_1 = require("../config/dbConfig");
const App_1 = __importDefault(require("../routes/App"));
const StarshipService_1 = require("../services/starships/StarshipService");
const errorHandler_1 = require("../middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', App_1.default);
app.use(errorHandler_1.errorHandler);
jest.mock('../services/starships/StarshipService');
describe('GET /api/starships', () => {
    beforeAll(async () => {
        await (0, dbConfig_1.dbConexion)();
    });
    it('debería devolver una lista de naves estelares', async () => {
        StarshipService_1.StarshipService.getStarships.mockResolvedValue({
            total: 2,
            currentPage: 1,
            totalPages: 1,
            data: [{ name: 'Millennium Falcon' }, { name: 'X-wing' }]
        });
        const response = await (0, supertest_1.default)(app)
            .get('/api/starships?page=1&limit=10');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('currentPage');
        expect(response.body).toHaveProperty('totalPages');
    });
    it('debería devolver un error 400 con parámetros inválidos', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/api/starships?page=abc&limit=xyz');
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
    it('debería devolver un error 500 en caso de error del servidor', async () => {
        StarshipService_1.StarshipService.getStarships.mockRejectedValue(new Error('Error simulado'));
        const response = await (0, supertest_1.default)(app).get('/api/starships').set('Accept', 'application/json');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error simulado');
    });
});
