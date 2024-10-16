import request from 'supertest';
import express from 'express';
import { dbConexion } from '../config/dbConfig';
import router from '../routes/App';
import { PlanetService } from '../services/planets/PlanetService';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

jest.mock('../services/planets/PlanetService');

describe('GET /api/planets', () => {
  beforeAll(async () => {
    await dbConexion();
  });

  it('debería devolver una lista de planetas', async () => {
    
    (PlanetService.getPlanets as jest.Mock).mockResolvedValue({
      total: 2,
      currentPage: 1,
      totalPages: 1,
      data: [{ name: 'Tatooine' }, { name: 'Alderaan' }]
    });

    const response = await request(app)
      .get('/api/planets?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('currentPage');
    expect(response.body).toHaveProperty('totalPages');
  });

  it('debería devolver un error 400 con parámetros inválidos', async () => {
    const response = await request(app)
      .get('/api/planets?page=abc&limit=xyz');

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('debería devolver un error 500 en caso de error del servidor', async () => {
    
    (PlanetService.getPlanets as jest.Mock).mockRejectedValue(new Error('Error simulado'));
  
    const response = await request(app).get('/api/planets').set('Accept', 'application/json');
  
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error simulado'); 
  });
});
