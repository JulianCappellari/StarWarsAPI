"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPlanetsData = void 0;
const class_validator_1 = require("class-validator");
const axios_1 = __importDefault(require("axios"));
const PlanetDto_1 = require("../../dto/PlanetDto");
const Planets_1 = __importDefault(require("../../models/Planets"));
const syncPlanetsData = async () => {
    try {
        const response = await axios_1.default.get('https://swapi.dev/api/planets');
        const planetsData = response.data.results;
        const validPlanets = [];
        for (const planet of planetsData) {
            const planetDto = new PlanetDto_1.PlanetDto();
            Object.assign(planetDto, planet);
            const errors = await (0, class_validator_1.validate)(planetDto);
            if (errors.length > 0) {
                console.error(`Validation failed for planet: ${planet.name}`, errors);
                continue;
            }
            validPlanets.push(planetDto);
        }
        // Inserta o actualiza los datos válidos en una sola operación
        await Planets_1.default.bulkWrite(validPlanets.map((planet) => ({
            updateOne: {
                filter: { name: planet.name },
                update: planet,
                upsert: true,
            },
        })));
        console.log('Planets data synchronized');
    }
    catch (error) {
        console.error('Error syncing planets data:', error);
    }
};
exports.syncPlanetsData = syncPlanetsData;
