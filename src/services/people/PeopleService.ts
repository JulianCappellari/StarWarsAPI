import People from "../../models/People";
import { paginate } from "../paginate";


export class PeopleService {
  static async getPeople({ name, page, limit }: { name?: string, page: number, limit: number }) {
    const filter = name ? { name: new RegExp(name, "i") } : {};
    
    try {
      const { data, total } = await paginate(People, filter, page, limit);
      const totalPages = Math.ceil(total / limit);
      
      return {
        total,
        currentPage: page,
        totalPages,
        data,
      };
    } catch (error) {
      throw new Error(`Error fetching people: ${(error as Error).message}`);
    }
  }
}
