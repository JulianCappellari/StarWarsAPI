"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConfig_1 = require("./config/dbConfig");
require("./cron/scheduler");
const App_1 = __importDefault(require("./routes/App"));
require("dotenv/config");
const app = (0, express_1.default)();
const startServer = async () => {
    await (0, dbConfig_1.dbConexion)();
    console.log('Connected to MongoDB');
    // Llama a las funciones de sincronización manualmente para probarlas
    // await syncFilmsData(); // Puedes descomentar esto para probar la sincronización manualmente
    // await syncPeopleData();
    // await syncPlanetsData();
    // await syncStarshipsData();
    app.use(express_1.default.json());
    app.use('/api', App_1.default);
    app.listen(3001, () => {
        console.log('Servidor corriendo en el puerto 3000');
    });
};
startServer();
