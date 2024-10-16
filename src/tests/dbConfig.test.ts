import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dbConexion } from '../config/dbConfig';

dotenv.config();

jest.mock('mongoose');

describe('dbConexion', () => {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeAll(() => {
    
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restaurar la consola
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería conectar a la base de datos correctamente', async () => {
    process.env.CONNEXION_MONGOSE = 'mongodb://localhost/test'; 

    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

    await dbConexion();

    expect(console.log).toHaveBeenCalledWith('DB conectada correctamente');
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost/test');
  });

  it('debería lanzar un error si la URL de conexión no está definida', async () => {
    delete process.env.CONNEXION_MONGOSE; 

    await expect(dbConexion()).rejects.toThrow('No se pudo inicializar la base de datos');
    expect(console.error).toHaveBeenCalledWith(
      'Error al conectar con la base de datos:',
      expect.any(Error)
    );
  });

  it('debería lanzar un error si la conexión a la base de datos falla', async () => {
    process.env.CONNEXION_MONGOSE = 'mongodb://localhost/test'; 
    const errorMessage = 'Error de conexión';
    
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage)); 

    await expect(dbConexion()).rejects.toThrow('No se pudo inicializar la base de datos');
    expect(console.error).toHaveBeenCalledWith(
      'Error al conectar con la base de datos:',
      expect.any(Error)
    );
  });
});
