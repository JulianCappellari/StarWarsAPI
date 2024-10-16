"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanets = void 0;
const PlanetService_1 = require("../services/planets/PlanetService");
const getPlanets = async (req, res, next) => {
    const { name, page = 1, limit = 10 } = req.query;
    try {
        const result = await PlanetService_1.PlanetService.getPlanets({
            name: name,
            page: Number(page),
            limit: Number(limit),
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getPlanets = getPlanets;
