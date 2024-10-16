import Films from "../../models/Films";
import { paginate } from "../paginate";


export class FilmService {

    static async getFilms({ title, page , limit  }: { title?: string, page: number, limit: number }) {

        const filter = title ? { title: new RegExp(title, 'i') } : {}
        try {
            const { data, total } = await paginate(Films, filter, page, limit);
            const totalPages = Math.ceil(total / limit);
            return {
                total,
                currentPage: page,
                totalPages,
                data,
            };
        } catch (error) {
            throw new Error(`Error fetching films: ${(error as Error).message}`);
        }
    }
}