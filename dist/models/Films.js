"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const filmSchema = new mongoose_1.Schema({
    title: String,
    episode_id: Number,
    opening_crawl: String,
    director: String,
    producer: String,
    release_date: String,
    characters: [{ type: String }],
    planets: [{ type: String }],
    starships: [{ type: String }],
    vehicles: [String],
    species: [String],
    created: String,
    edited: String,
    url: String,
});
exports.default = (0, mongoose_1.model)('Film', filmSchema);
