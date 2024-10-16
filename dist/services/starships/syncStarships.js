"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStarshipsData = void 0;
const class_validator_1 = require("class-validator");
const axios_1 = __importDefault(require("axios"));
const StarshipDto_1 = require("../../dto/StarshipDto");
const Starships_1 = __importDefault(require("../../models/Starships"));
const syncStarshipsData = async () => {
    try {
        const response = await axios_1.default.get('https://swapi.dev/api/starships');
        const starshipsData = response.data.results;
        const validStarships = [];
        for (const starship of starshipsData) {
            const starshipDto = new StarshipDto_1.StarshipDto();
            Object.assign(starshipDto, starship);
            const errors = await (0, class_validator_1.validate)(starshipDto);
            if (errors.length > 0) {
                console.error(`Validation failed for starship: ${starship.name}`, errors);
                continue;
            }
            validStarships.push(starshipDto);
        }
        // Inserta o actualiza los datos válidos en una sola operación
        await Starships_1.default.bulkWrite(validStarships.map((starship) => ({
            updateOne: {
                filter: { name: starship.name },
                update: starship,
                upsert: true,
            },
        })));
        console.log('Starships data synchronized');
    }
    catch (error) {
        console.error('Error syncing starships data:', error);
    }
};
exports.syncStarshipsData = syncStarshipsData;
