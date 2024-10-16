import { StarshipService } from '../services/starships/StarshipService';
import Starships from '../models/Starships';
import { paginate } from '../services/paginate';

jest.mock('../models/Starships', () => {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
  };
});
jest.mock('../services/paginate');

describe('StarshipService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch starships without filters', async () => {
    const mockStarships = [{ name: 'Millennium Falcon' }, { name: 'X-wing' }];
    const mockPaginate = {
      data: mockStarships,
      total: 2,
    };

    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await StarshipService.getStarships({ name: '', page: 1, limit: 10 });

    expect(paginate).toHaveBeenCalledWith(Starships, {}, 1, 10);
    expect(result).toEqual({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: mockStarships,
    });
  });

  it('should filter starships by name', async () => {
    const mockStarships = [{ name: 'Millennium Falcon' }];
    const mockPaginate = {
      data: mockStarships,
      total: 1,
    };

    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await StarshipService.getStarships({ name: 'Millennium Falcon', page: 1, limit: 10 });

    expect(paginate).toHaveBeenCalledWith(Starships, { name: /Millennium Falcon/i }, 1, 10);
    expect(result).toEqual({
      total: 1,
      currentPage: 1,
      totalPages: 1,
      data: mockStarships,
    });
  });

  it('should handle errors in fetching starships', async () => {
    (paginate as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(StarshipService.getStarships({ name: '', page: 1, limit: 10 })).rejects.toThrow(
      'Error fetching starships: Database error'
    );
  });
});
