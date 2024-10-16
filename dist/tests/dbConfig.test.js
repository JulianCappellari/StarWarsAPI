"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = require("../config/dbConfig");
dotenv_1.default.config();
jest.mock('mongoose');
describe('dbConexion', () => {
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;
    beforeAll(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });
    afterAll(() => {
        // Restaurar la consola
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('debería conectar a la base de datos correctamente', async () => {
        process.env.CONNEXION_MONGOSE = 'mongodb://localhost/test';
        mongoose_1.default.connect.mockResolvedValueOnce(undefined);
        await (0, dbConfig_1.dbConexion)();
        expect(console.log).toHaveBeenCalledWith('DB conectada correctamente');
        expect(mongoose_1.default.connect).toHaveBeenCalledWith('mongodb://localhost/test');
    });
    it('debería lanzar un error si la URL de conexión no está definida', async () => {
        delete process.env.CONNEXION_MONGOSE;
        await expect((0, dbConfig_1.dbConexion)()).rejects.toThrow('No se pudo inicializar la base de datos');
        expect(console.error).toHaveBeenCalledWith('Error al conectar con la base de datos:', expect.any(Error));
    });
    it('debería lanzar un error si la conexión a la base de datos falla', async () => {
        process.env.CONNEXION_MONGOSE = 'mongodb://localhost/test';
        const errorMessage = 'Error de conexión';
        mongoose_1.default.connect.mockRejectedValueOnce(new Error(errorMessage));
        await expect((0, dbConfig_1.dbConexion)()).rejects.toThrow('No se pudo inicializar la base de datos');
        expect(console.error).toHaveBeenCalledWith('Error al conectar con la base de datos:', expect.any(Error));
    });
});
