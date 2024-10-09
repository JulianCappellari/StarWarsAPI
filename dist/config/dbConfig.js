"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConexion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConexion = async () => {
    try {
        const dbUrl = process.env.CONNEXION_MONGOSE;
        if (!dbUrl) {
            throw new Error('La variable de entorno CONNEXION_MONGOSE no está definida');
        }
        console.log(dbUrl);
        await mongoose_1.default.connect(dbUrl);
        console.log('DB conectada correctamente');
    }
    catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw new Error('No se pudo inicializar la base de datos');
    }
};
exports.dbConexion = dbConexion;
