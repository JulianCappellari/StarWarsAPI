"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPeopleData = void 0;
const class_validator_1 = require("class-validator");
const axios_1 = __importDefault(require("axios"));
const People_1 = __importDefault(require("../../models/People"));
const PeopleDto_1 = require("../../dto/PeopleDto");
const syncPeopleData = async () => {
    try {
        const response = await axios_1.default.get('https://swapi.dev/api/people');
        const peopleData = response.data.results;
        const validPeople = [];
        for (const person of peopleData) {
            const personDto = new PeopleDto_1.PeopleDto();
            Object.assign(personDto, person);
            const errors = await (0, class_validator_1.validate)(personDto);
            if (errors.length > 0) {
                console.error(`Validation failed for person: ${person.name}`, errors);
                continue;
            }
            validPeople.push(personDto);
        }
        // Inserta o actualiza los datos válidos en una sola operación
        await People_1.default.bulkWrite(validPeople.map((person) => ({
            updateOne: {
                filter: { name: person.name },
                update: person,
                upsert: true,
            },
        })));
        console.log('People data synchronized');
    }
    catch (error) {
        console.error('Error syncing people data:', error);
    }
};
exports.syncPeopleData = syncPeopleData;
