import { PlanetService } from '../services/planets/PlanetService';
import Planet from '../models/Planets';
import { paginate } from '../services/paginate';

jest.mock('../models/Planets');
jest.mock('../services/paginate');

describe('PlanetService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch planets without filters', async () => {
    const mockPlanets = [{ name: 'Tatooine' }, { name: 'Alderaan' }];
    const mockPaginate = {
      data: mockPlanets,
      total: 2
    };
    
    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await PlanetService.getPlanets({ name: '', page: 1, limit: 10 });
    
    expect(paginate).toHaveBeenCalledWith(Planet, {}, 1, 10);
    expect(result).toEqual({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: mockPlanets
    });
  });

  it('should filter planets by name', async () => {
    const mockPlanets = [{ name: 'Tatooine' }];
    const mockPaginate = {
      data: mockPlanets,
      total: 1
    };
    
    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await PlanetService.getPlanets({ name: 'Tatooine', page: 1, limit: 10 });
    
    expect(paginate).toHaveBeenCalledWith(Planet, { name: /Tatooine/i }, 1, 10);
    expect(result).toEqual({
      total: 1,
      currentPage: 1,
      totalPages: 1,
      data: mockPlanets
    });
  });

  it('should handle errors in fetching planets', async () => {
    (paginate as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(PlanetService.getPlanets({ name: '', page: 1, limit: 10 })).rejects.toThrow(
      'Error fetching planets: Database error'
    );
  });
});
 