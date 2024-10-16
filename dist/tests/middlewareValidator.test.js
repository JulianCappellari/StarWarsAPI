"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/__tests__/middlewareValidator.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const middlewareValidator_1 = require("../middleware/middlewareValidator");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/api/test', middlewareValidator_1.middlewareValidator, (req, res) => {
    res.status(200).send('OK');
});
describe('Middleware Validator', () => {
    it('debería devolver un error 400 para parámetros inválidos', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/api/test?page=abc&limit=xyz');
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
    it('debería continuar si los parámetros son válidos', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/api/test?page=1&limit=10');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });
});
