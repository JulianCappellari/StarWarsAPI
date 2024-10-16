"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarshipService = void 0;
const Starships_1 = __importDefault(require("../../models/Starships"));
const paginate_1 = require("../paginate");
class StarshipService {
    static async getStarships({ name, page, limit }) {
        const filter = name ? { name: new RegExp(name, 'i') } : {};
        try {
            const { data, total } = await (0, paginate_1.paginate)(Starships_1.default, filter, page, limit);
            const totalPages = Math.ceil(total / limit);
            return {
                total,
                currentPage: page,
                totalPages,
                data,
            };
        }
        catch (error) {
            throw new Error(`Error fetching starships: ${error.message}`);
        }
    }
}
exports.StarshipService = StarshipService;
