"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmService = void 0;
const Films_1 = __importDefault(require("../../models/Films"));
const paginate_1 = require("../paginate");
class FilmService {
    static async getFilms({ title, page, limit }) {
        const filter = title ? { title: new RegExp(title, 'i') } : {};
        try {
            const { data, total } = await (0, paginate_1.paginate)(Films_1.default, filter, page, limit);
            const totalPages = Math.ceil(total / limit);
            return {
                total,
                currentPage: page,
                totalPages,
                data,
            };
        }
        catch (error) {
            throw new Error(`Error fetching films: ${error.message}`);
        }
    }
}
exports.FilmService = FilmService;
