"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStarships = void 0;
const StarshipService_1 = require("../services/starships/StarshipService");
const getStarships = async (req, res, next) => {
    const { name, page = 1, limit = 10 } = req.query;
    try {
        const result = await StarshipService_1.StarshipService.getStarships({
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
exports.getStarships = getStarships;
