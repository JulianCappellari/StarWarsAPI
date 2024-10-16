import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/test', (req, res) => {
  throw new Error('Error de prueba');
});
app.use(errorHandler);

describe('Error Handler', () => {
  afterEach(() => {
    
    process.env.NODE_ENV = 'test';
  });

  it('debería devolver un error 500 para errores no manejados', async () => {
    const response = await request(app).get('/api/test');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error de prueba');
  });

  it('debería manejar errores en un entorno diferente a "test"', async () => {
    
    process.env.NODE_ENV = 'development';
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(app).get('/api/test');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error de prueba');
    expect(consoleSpy).toHaveBeenCalled(); 

    
    consoleSpy.mockRestore();
  });

  it('no debería llamar a console.error en entorno de prueba', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(app).get('/api/test');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error de prueba');
    expect(consoleSpy).not.toHaveBeenCalled(); 
    
    consoleSpy.mockRestore();
  });
});
