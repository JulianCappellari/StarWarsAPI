"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const syncPeople_1 = require("../services/people/syncPeople");
const syncFilms_1 = require("../services/film/syncFilms");
const syncStarships_1 = require("../services/starships/syncStarships");
const syncPlanets_1 = require("../services/planets/syncPlanets");
console.log('Scheduler initialized.');
const runSyncs = async () => {
    console.log('Running syncs...');
    await Promise.all([
        (0, syncPeople_1.syncPeopleData)(),
        (0, syncFilms_1.syncFilmsData)(),
        (0, syncStarships_1.syncStarshipsData)(),
        (0, syncPlanets_1.syncPlanetsData)(),
    ]);
};
// Inicializa la sincronización
runSyncs();
// Cron job único para todas las sincronizaciones
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('Running scheduled sync...');
    await runSyncs();
});
