"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const errorHandler_1 = require("../middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/test', (req, res) => {
    throw new Error('Error de prueba');
});
app.use(errorHandler_1.errorHandler);
describe('Error Handler', () => {
    afterEach(() => {
        process.env.NODE_ENV = 'test';
    });
    it('debería devolver un error 500 para errores no manejados', async () => {
        const response = await (0, supertest_1.default)(app).get('/api/test');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error de prueba');
    });
    it('debería manejar errores en un entorno diferente a "test"', async () => {
        process.env.NODE_ENV = 'development';
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const response = await (0, supertest_1.default)(app).get('/api/test');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error de prueba');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
    it('no debería llamar a console.error en entorno de prueba', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const response = await (0, supertest_1.default)(app).get('/api/test');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error de prueba');
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
