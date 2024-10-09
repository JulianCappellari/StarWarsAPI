"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPlanetsData = void 0;
const axios_1 = __importDefault(require("axios"));
const Planets_1 = __importDefault(require("../models/Planets"));
const syncPlanetsData = async () => {
    try {
        console.log('Fetching planets data from API...');
        const response = await axios_1.default.get('https://swapi.dev/api/planets');
        const planetsData = response.data.results;
        console.log(`Fetched ${planetsData.length} planets from API.`);
        for (const planet of planetsData) {
            console.log(`Updating or inserting planet: ${planet.name}`);
            await Planets_1.default.updateOne({ name: planet.name }, planet, { upsert: true });
        }
        console.log('Planets data synchronized');
    }
    catch (error) {
        console.error('Error syncing planets data:', error);
    }
};
exports.syncPlanetsData = syncPlanetsData;
