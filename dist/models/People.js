"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const peopleSchema = new mongoose_1.Schema({
    name: String,
    height: String,
    mass: String,
    hair_color: String,
    skin_color: String,
    eye_color: String,
    birth_year: String,
    gender: String,
    homeworld: { type: String },
    films: [{ type: String }],
    species: [String],
    vehicles: [String],
    starships: [{ type: String }],
    created: String,
    edited: String,
    url: String,
});
exports.default = (0, mongoose_1.model)('People', peopleSchema);
