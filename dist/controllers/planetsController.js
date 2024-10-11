"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanets = void 0;
const Planets_1 = __importDefault(require("../models/Planets"));
const axios_1 = __importDefault(require("axios"));
const getPlanets = async (req, res, next) => {
    const { name, page = 1, limit = 10 } = req.query;
    if (page && isNaN(Number(page))) {
        res.status(400).json({ error: "Parametro invalido: page debe ser un numero." });
        return;
    }
    if (limit && isNaN(Number(limit))) {
        res.status(400).json({ error: "Parametro invalido: limit debe ser un numero." });
        return;
    }
    const filter = name ? { name: new RegExp(name, "i") } : {};
    try {
        let planets = await Planets_1.default.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        if (planets.length === 0) {
            const response = await axios_1.default.get("https://swapi.dev/api/planets/");
            planets = response.data.results;
            await Planets_1.default.insertMany(planets);
            planets = await Planets_1.default.find(filter)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
        }
        const total = await Planets_1.default.countDocuments(filter);
        res.json({
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: planets,
        });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
};
exports.getPlanets = getPlanets;
