// src/__tests__/middlewareValidator.test.ts
import request from 'supertest';
import express, { Request, Response } from 'express';
import { middlewareValidator } from '../middleware/middlewareValidator';

const app = express();
app.use(express.json());
app.get('/api/test', middlewareValidator, (req: Request, res: Response) => {
  res.status(200).send('OK');
});

describe('Middleware Validator', () => {
  it('debería devolver un error 400 para parámetros inválidos', async () => {
    const response = await request(app)
      .get('/api/test?page=abc&limit=xyz');

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('debería continuar si los parámetros son válidos', async () => {
    const response = await request(app)
      .get('/api/test?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
