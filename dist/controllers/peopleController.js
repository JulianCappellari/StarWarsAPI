"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeople = void 0;
const PeopleService_1 = require("../services/people/PeopleService");
const getPeople = async (req, res, next) => {
    const { name = '', page = 1, limit = 10 } = req.query;
    try {
        const result = await PeopleService_1.PeopleService.getPeople({
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
exports.getPeople = getPeople;
