
import Planets from '../../models/Planets';
import { paginate } from '../paginate';

export class PlanetService {
  static async getPlanets({ name, page, limit }: { name?: string, page: number, limit: number }) {
    const filter = name ? { name: new RegExp(name, 'i') } : {};
    
    try {
      const { data, total } = await paginate(Planets, filter, page, limit);
      const totalPages = Math.ceil(total / limit);
      
      return {
        total,
        currentPage: page,
        totalPages,
        data,
      };
    } catch (error) {
      throw new Error(`Error fetching planets: ${(error as Error).message}`);
    }
  }
}
