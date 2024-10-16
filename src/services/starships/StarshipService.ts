
import Starships from '../../models/Starships';
import { paginate } from '../paginate';

export class StarshipService {
  static async getStarships({ name, page, limit }: { name?: string, page: number, limit: number }) {
    const filter = name ? { name: new RegExp(name, 'i') } : {};
    
    try {
      const { data, total } = await paginate(Starships, filter, page, limit);
      const totalPages = Math.ceil(total / limit);
      
      return {
        total,
        currentPage: page,
        totalPages,
        data,
      };
    } catch (error) {
      throw new Error(`Error fetching starships: ${(error as Error).message}`);
    }
  }
}
