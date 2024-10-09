"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planetSchema = new mongoose_1.Schema({
    name: String,
    rotation_period: String,
    orbital_period: String,
    diameter: String,
    climate: String,
    gravity: String,
    terrain: String,
    surface_water: String,
    population: String,
    residents: [{ type: String }],
    films: [{ type: String }],
    created: String,
    edited: String,
    url: String,
});
exports.default = (0, mongoose_1.model)('Planet', planetSchema);
