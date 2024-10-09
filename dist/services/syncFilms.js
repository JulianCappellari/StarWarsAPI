"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncFilmsData = void 0;
const axios_1 = __importDefault(require("axios"));
const Films_1 = __importDefault(require("../models/Films"));
const syncFilmsData = async () => {
    try {
        console.log('Fetching films data from API...');
        const response = await axios_1.default.get('https://swapi.dev/api/films');
        const filmsData = response.data.results;
        console.log(`Fetched ${filmsData.length} films from API.`);
        for (const film of filmsData) {
            console.log(`Updating or inserting film: ${film.title}`);
            await Films_1.default.updateOne({ title: film.title }, film, { upsert: true });
        }
        console.log('Films data synchronized');
    }
    catch (error) {
        console.error('Error syncing films data:', error);
    }
};
exports.syncFilmsData = syncFilmsData;
