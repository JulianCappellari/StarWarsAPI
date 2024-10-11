"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConfig_1 = require("./config/dbConfig");
require("./cron/scheduler");
require("dotenv/config");
const App_1 = __importDefault(require("./routes/App"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});
// Swagger 
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Star Wars',
            version: '1.0.0',
            description: 'Documentación de la API para sincronizar datos de Star Wars',
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
const startServer = async () => {
    await (0, dbConfig_1.dbConexion)();
    console.log('Conectada a MongoDB');
    // Llama a las funciones de sincronización manualmente para probarlas
    // await syncFilmsData(); // Puedes descomentar esto para probar la sincronización manualmente
    // await syncPeopleData();
    // await syncPlanetsData();
    // await syncStarshipsData();
    app.use(express_1.default.json());
    app.use('/api', App_1.default);
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
};
startServer();
