"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStarships = void 0;
const Startships_1 = __importDefault(require("../models/Startships"));
const axios_1 = __importDefault(require("axios"));
const getStarships = async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query;
    const filter = name ? { name: new RegExp(name, "i") } : {};
    let starships = await Startships_1.default.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    if (starships.length === 0) {
        const response = await axios_1.default.get("https://swapi.dev/api/starships");
        starships = response.data.results;
        await Startships_1.default.insertMany(Startships_1.default);
        starships = await Startships_1.default.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
    }
    const total = await Startships_1.default.countDocuments(filter);
    res.json({
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        data: starships,
    });
};
exports.getStarships = getStarships;
