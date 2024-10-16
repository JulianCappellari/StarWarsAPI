"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilms = void 0;
const FilmService_1 = require("../services/film/FilmService");
const getFilms = async (req, res, next) => {
    const { title, page = 1, limit = 10 } = req.query;
    try {
        const result = await FilmService_1.FilmService.getFilms({
            title: title,
            page: Number(page),
            limit: Number(limit),
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getFilms = getFilms;
