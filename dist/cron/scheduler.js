"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const syncPeople_1 = require("../services/syncPeople");
const syncFilms_1 = require("../services/syncFilms");
const syncStarships_1 = require("../services/syncStarships");
const syncPlanets_1 = require("../services/syncPlanets");
console.log('Scheduler initialized.');
// Función para ejecutar la sincronización
const runSyncs = async () => {
    console.log('Running initial syncs...');
    await (0, syncPeople_1.syncPeopleData)();
    await (0, syncFilms_1.syncFilmsData)();
    await (0, syncStarships_1.syncStarshipsData)();
    await (0, syncPlanets_1.syncPlanetsData)();
};
// Llama a la función de sincronización inicial al iniciar el servidor
runSyncs();
// Sincroniza los datos de People cada 24 horas
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('Running sync for People data...');
    await (0, syncPeople_1.syncPeopleData)();
});
// Sincroniza los datos de Films cada 24 horas
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('Running sync for Films data...');
    await (0, syncFilms_1.syncFilmsData)();
});
// Sincroniza los datos de Starships cada 24 horas
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('Running sync for Starships data...');
    await (0, syncStarships_1.syncStarshipsData)();
});
// Sincroniza los datos de Planets cada 24 horas
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('Running sync for Planets data...');
    await (0, syncPlanets_1.syncPlanetsData)();
});
