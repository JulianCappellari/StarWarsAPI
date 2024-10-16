
import Films from '../models/Films'; 
import { FilmService } from '../services/film/FilmService';
import { paginate } from '../services/paginate';

jest.mock('../models/Films');
jest.mock('../services/paginate');

describe('FilmService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch films without filters', async () => {
    const mockFilms = [{ title: 'A New Hope' }, { title: 'The Empire Strikes Back' }];
    const mockPaginate = {
      data: mockFilms,
      total: 2
    };
    
    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await FilmService.getFilms({ title: '', page: 1, limit: 10 });
    
    expect(paginate).toHaveBeenCalledWith(Films, {}, 1, 10);
    expect(result).toEqual({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: mockFilms
    });
  });

  it('should filter films by title', async () => {
    const mockFilms = [{ title: 'A New Hope' }];
    const mockPaginate = {
      data: mockFilms,
      total: 1
    };
    
    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await FilmService.getFilms({ title: 'A New Hope', page: 1, limit: 10 });
    
    expect(paginate).toHaveBeenCalledWith(Films, { title: /A New Hope/i }, 1, 10);
    expect(result).toEqual({
      total: 1,
      currentPage: 1,
      totalPages: 1,
      data: mockFilms
    });
  });

  it('should handle errors in fetching films', async () => {
    (paginate as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(FilmService.getFilms({ title: '', page: 1, limit: 10 })).rejects.toThrow(
      'Error fetching films: Database error'
    );
  });
});
