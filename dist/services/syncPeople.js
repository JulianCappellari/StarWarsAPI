"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPeopleData = void 0;
const axios_1 = __importDefault(require("axios"));
const People_1 = __importDefault(require("../models/People"));
const syncPeopleData = async () => {
    try {
        console.log('Fetching people data from API...');
        const response = await axios_1.default.get('https://swapi.dev/api/people');
        const peopleData = response.data.results;
        console.log(`Fetched ${peopleData.length} people from API.`);
        for (const person of peopleData) {
            console.log(`Updating or inserting person: ${person.name}`);
            await People_1.default.updateOne({ name: person.name }, person, { upsert: true });
        }
        console.log('People data synchronized');
    }
    catch (error) {
        console.error('Error syncing people data:', error);
    }
};
exports.syncPeopleData = syncPeopleData;
