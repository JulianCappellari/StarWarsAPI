"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const starshipSchema = new mongoose_1.Schema({
    name: String,
    model: String,
    manufacturer: String,
    cost_in_credits: String,
    length: String,
    max_atmosphering_speed: String,
    crew: String,
    passengers: String,
    cargo_capacity: String,
    consumables: String,
    hyperdrive_rating: String,
    MGLT: String,
    starship_class: String,
    pilots: [{ type: String }],
    films: [{ type: String }],
    created: String,
    edited: String,
    url: String,
});
exports.default = (0, mongoose_1.model)('Starship', starshipSchema);
