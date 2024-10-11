"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeople = void 0;
const People_1 = __importDefault(require("../models/People"));
const axios_1 = __importDefault(require("axios"));
const getPeople = async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query;
    const filter = name ? { name: new RegExp(name, "i") } : {};
    // Validar los parámetros de paginación
    if (page && isNaN(Number(page))) {
        return res.status(400).json({ error: "Invalid parameter: page must be a number." });
    }
    if (limit && isNaN(Number(limit))) {
        return res.status(400).json({ error: "Invalid parameter: limit must be a number." });
    }
    try {
        let people = await People_1.default.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        if (people.length === 0) {
            const response = await axios_1.default.get("https://swapi.dev/api/people");
            people = response.data.results;
            await People_1.default.insertMany(people);
            people = await People_1.default.find(filter)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
        }
        const total = await People_1.default.countDocuments(filter);
        return res.json({
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: people,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
};
exports.getPeople = getPeople;
