"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanets = void 0;
const Planets_1 = __importDefault(require("../models/Planets"));
const axios_1 = __importDefault(require("axios"));
const getPlanets = async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query;
    const filter = name ? { name: new RegExp(name, "i") } : {};
    let people = await Planets_1.default.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    if (people.length === 0) {
        const response = await axios_1.default.get("https://swapi.dev/api/planets/");
        people = response.data.results;
        await Planets_1.default.insertMany(people);
        people = await Planets_1.default.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
    }
    const total = await Planets_1.default.countDocuments(filter);
    res.json({
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        data: people,
    });
};
exports.getPlanets = getPlanets;
