
import { PeopleService } from '../services/people/PeopleService';
import People from '../models/People';
import { paginate } from '../services/paginate';

jest.mock('../models/People');
jest.mock('../services/paginate');

describe('PeopleService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería obtener personas sin filtros', async () => {
    const mockPeople = [{ name: 'Luke Skywalker' }, { name: 'Leia Organa' }];
    const mockPaginate = {
      data: mockPeople,
      total: 2
    };

    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await PeopleService.getPeople({ name: '', page: 1, limit: 10 });

    expect(paginate).toHaveBeenCalledWith(People, {}, 1, 10);
    expect(result).toEqual({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: mockPeople
    });
  });

  it('debería filtrar personas por nombre', async () => {
    const mockPeople = [{ name: 'Luke Skywalker' }];
    const mockPaginate = {
      data: mockPeople,
      total: 1
    };

    (paginate as jest.Mock).mockResolvedValue(mockPaginate);

    const result = await PeopleService.getPeople({ name: 'Luke', page: 1, limit: 10 });

    expect(paginate).toHaveBeenCalledWith(People, { name: /Luke/i }, 1, 10);
    expect(result).toEqual({
      total: 1,
      currentPage: 1,
      totalPages: 1,
      data: mockPeople
    });
  });

  it('debería manejar errores al obtener personas', async () => {
    (paginate as jest.Mock).mockRejectedValue(new Error('Error de la base de datos'));

    await expect(PeopleService.getPeople({ name: '', page: 1, limit: 10 })).rejects.toThrow(
      'Error fetching people: Error de la base de datos'
    );
  });
});
