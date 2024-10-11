"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStarships = void 0;
const axios_1 = __importDefault(require("axios"));
const Starships_1 = __importDefault(require("../models/Starships"));
const getStarships = async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query;
    if (page && isNaN(Number(page))) {
        return res.status(400).json({ error: "Invalid parameter: page must be a number." });
    }
    if (limit && isNaN(Number(limit))) {
        return res.status(400).json({ error: "Invalid parameter: limit must be a number." });
    }
    try {
        const filter = name ? { name: new RegExp(name, "i") } : {};
        let starships = await Starships_1.default.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        if (starships.length === 0) {
            const response = await axios_1.default.get("https://swapi.dev/api/starships");
            starships = response.data.results;
            await Starships_1.default.insertMany(starships);
            starships = await Starships_1.default.find(filter)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
        }
        const total = await Starships_1.default.countDocuments(filter);
        return res.json({
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: starships,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
};
exports.getStarships = getStarships;
