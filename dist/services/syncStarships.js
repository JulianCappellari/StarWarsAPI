"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStarshipsData = void 0;
const axios_1 = __importDefault(require("axios"));
const Starships_1 = __importDefault(require("../models/Starships")); // Asegúrate de que el nombre del modelo sea correcto.
const syncStarshipsData = async () => {
    try {
        console.log('Fetching starships data from API...');
        const response = await axios_1.default.get('https://swapi.dev/api/starships');
        const starshipsData = response.data.results;
        console.log(`Fetched ${starshipsData.length} starships from API.`);
        for (const starship of starshipsData) {
            console.log(`Updating or inserting starship: ${starship.name}`);
            await Starships_1.default.updateOne({ name: starship.name }, starship, { upsert: true });
        }
        console.log('Starships data synchronized');
    }
    catch (error) {
        console.error('Error syncing starships data:', error);
    }
};
exports.syncStarshipsData = syncStarshipsData;
