const { getPeople } = require('../controllers/peopleController');
const People = require('../models/People');
const axios = require('axios');

jest.mock('axios'); 

describe('getPeople', () => {
  it('should return people from database when available', async () => {
    const req = {
      query: { page: '1', limit: '10' },
    };

    const res = {
      json: jest.fn(),
    };

    
    People.find = jest.fn().mockResolvedValue([{ name: 'John Doe' }]);
    People.countDocuments = jest.fn().mockResolvedValue(1);

    await getPeople(req, res);

    expect(res.json).toHaveBeenCalledWith({
      total: 1,
      currentPage: 1,
      totalPages: 1,
      data: [{ name: 'John Doe' }],
    });
  });

  it('should fetch people from swapi.dev and save to database when no people in DB', async () => {
    const req = {
      query: { page: '1', limit: '10' },
    };

    const res = {
      json: jest.fn(),
    };

    
    People.find = jest.fn().mockResolvedValue([]);
    People.countDocuments = jest.fn().mockResolvedValue(0);

    
    axios.get.mockResolvedValue({
      data: {
        results: [
          { name: 'Luke Skywalker' },
          { name: 'Darth Vader' },
        ],
      },
    });

    await getPeople(req, res);

    
    expect(People.insertMany).toHaveBeenCalledWith([
      { name: 'Luke Skywalker' },
      { name: 'Darth Vader' },
    ]);

    
    expect(res.json).toHaveBeenCalledWith({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: [
        { name: 'Luke Skywalker' },
        { name: 'Darth Vader' },
      ],
    });
  });

  it('should filter people by name when provided', async () => {
    const req = {
      query: { page: '1', limit: '10', name: 'John' },
    };

    const res = {
      json: jest.fn(),
    };

    
    People.find = jest.fn().mockResolvedValue([{ name: 'John Doe' }]);
    People.countDocuments = jest.fn().mockResolvedValue(1);

    await getPeople(req, res);

    expect(People.find).toHaveBeenCalledWith({ name: expect.any(Object) }); 
    expect(res.json).toHaveBeenCalledWith({
      total: 1,
      currentPage: 1,
      totalPages: 1,
      data: [{ name: 'John Doe' }],
    });
  });
});
