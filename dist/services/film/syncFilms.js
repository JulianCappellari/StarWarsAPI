"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncFilmsData = void 0;
// DTO para validar películas
const class_validator_1 = require("class-validator");
const axios_1 = __importDefault(require("axios"));
const Films_1 = __importDefault(require("../../models/Films"));
const FilmDto_1 = require("../../dto/FilmDto");
const syncFilmsData = async () => {
    try {
        console.log('Fetching films data from API...');
        const response = await axios_1.default.get('https://swapi.dev/api/films');
        const filmsData = response.data.results;
        console.log(`Fetched ${filmsData.length} films from API.`);
        const validFilms = [];
        for (const film of filmsData) {
            const filmDto = new FilmDto_1.FilmsDto();
            Object.assign(filmDto, film);
            const errors = await (0, class_validator_1.validate)(filmDto);
            if (errors.length > 0) {
                console.error(`Validation failed for film: ${film.title}`, errors);
                continue;
            }
            validFilms.push(filmDto);
        }
        // Inserta o actualiza los datos válidos en una sola operación
        await Films_1.default.bulkWrite(validFilms.map((film) => ({
            updateOne: {
                filter: { title: film.title },
                update: film,
                upsert: true,
            },
        })));
        console.log('Films data synchronized');
    }
    catch (error) {
        console.error('Error syncing films data:', error);
    }
};
exports.syncFilmsData = syncFilmsData;
