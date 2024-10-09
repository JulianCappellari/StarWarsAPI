"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilms = void 0;
const Films_1 = __importDefault(require("../models/Films"));
const axios_1 = __importDefault(require("axios"));
const getFilms = async (req, res) => {
    const { title, page = 1, limit = 10 } = req.query;
    const filter = title ? { title: new RegExp(title, "i") } : {};
    let film = await Films_1.default.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    if (film.length === 0) {
        const response = await axios_1.default.get("https://swapi.dev/api/films/");
        film = response.data.results;
        await Films_1.default.insertMany(film);
        film = await Films_1.default.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
    }
    const total = await Films_1.default.countDocuments(filter);
    res.json({
        total,
        currentPage: Number(page),
        films: film,
    });
};
exports.getFilms = getFilms;
