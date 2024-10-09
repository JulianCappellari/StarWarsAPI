import { Request, Response } from 'express';
import { getFilms } from '../controllers/filmsController';
import Films from '../models/Films';
import axios from 'axios';

jest.mock('axios'); 

describe('getFilms', () => {
  it('should return films from database when available', async () => {
    const req = {
      query: { page: '1', limit: '10' },
    } as Partial<Request>;

    const res = {
      json: jest.fn(),
    } as unknown as Response;

    
    Films.find = jest.fn().mockResolvedValue([{ title: 'Film 1' }]);
    Films.countDocuments = jest.fn().mockResolvedValue(1);

    await getFilms(req as Request, res);

    expect(res.json).toHaveBeenCalledWith({
      total: 1,
      currentPage: 1,
      films: [{ title: 'Film 1' }],
    });
  });

  it('should fetch films from swapi.dev and save to database when no films in DB', async () => {
    const req = {
      query: { page: '1', limit: '10' },
    } as Partial<Request>;

    const res = {
      json: jest.fn(),
    } as unknown as Response;

    
    Films.find = jest.fn().mockResolvedValue([]);
    Films.countDocuments = jest.fn().mockResolvedValue(0);

    
    (axios.get as jest.Mock).mockResolvedValue({
      data: { results: [{ title: 'Film 2' }] },
    });

    await getFilms(req as Request, res);

    
    expect(Films.insertMany).toHaveBeenCalledWith([{ title: 'Film 2' }]);
    expect(res.json).toHaveBeenCalledWith({
      total: 1,
      currentPage: 1,
      films: [{ title: 'Film 2' }],
    });
  });
});
