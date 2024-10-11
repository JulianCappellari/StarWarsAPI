import { getFilms } from '../controllers/filmsController'; // Importa la función del controlador que se quiere testear
import Films from '../models/Films'; // Importa el modelo de películas (Films) que interactúa con la base de datos
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP a la API externa
import { Request, Response } from 'express'; // Importa los tipos de Request y Response de Express

// Mockear el modelo Films y axios para las pruebas
jest.mock('../models/Films', () => ({
  find: jest.fn(), // Mockea el método `find` del modelo para simular la búsqueda en la base de datos
  skip: jest.fn(), // Mockea el método `skip` para la paginación
  limit: jest.fn(), // Mockea el método `limit` para limitar la cantidad de resultados
  insertMany: jest.fn(), // Mockea el método `insertMany` para insertar datos en la base de datos
  countDocuments: jest.fn(), // Mockea el método `countDocuments` para contar el número de películas
}));

jest.mock('axios'); // Mockea axios para simular las llamadas a la API externa

describe('GET /api/films', () => {
  beforeEach(() => {
    jest.clearAllMocks();  // Limpiar los mocks antes de cada prueba para evitar que las llamadas anteriores interfieran
  });

  it('should return films from the database', async () => {
    jest.setTimeout(10000);  // Aumentar el timeout a 10 segundos para evitar que falle por falta de tiempo

    // Mockear la respuesta de la base de datos
    (Films.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([
          { title: 'Return of the Jedi', episode_id: 6 }, // Simula que se encuentran estas películas en la base de datos
          { title: 'A New Hope', episode_id: 4 }
        ]),
      }),
    });

    (Films.countDocuments as jest.Mock).mockResolvedValue(2); // Simula que hay 2 películas en total en la base de datos

    // Simula una petición HTTP de tipo GET con parámetros de paginación
    const req = { query: { page: '1', limit: '10' } } as unknown as Request;
    const res = {
      json: jest.fn(), // Mockea el método `json` del response para capturar la respuesta que enviaría el servidor
      status: jest.fn().mockReturnThis(), // Mockea el método `status` para definir el código de estado HTTP
    } as unknown as Response;

    await getFilms(req, res); // Llama al controlador que se está testeando

    // Verifica que se llamó a `find` en la base de datos con el filtro vacío (busca todas las películas)
    expect(Films.find).toHaveBeenCalledWith({});
    // Verifica que se llamó a `countDocuments` para contar el total de películas
    expect(Films.countDocuments).toHaveBeenCalledWith({});
    // Verifica que la respuesta JSON es la esperada
    expect(res.json).toHaveBeenCalledWith({
      total: 2, // Total de películas en la base de datos
      currentPage: 1, // Página actual
      films: [ // Lista de películas devueltas
        { title: 'Return of the Jedi', episode_id: 6 },
        { title: 'A New Hope', episode_id: 4 }
      ]
    });
  });

  it('should fetch films from the external API if not found in the database', async () => {
    jest.setTimeout(10000);  // Aumentar el timeout a 10 segundos para esta prueba
  
    // Mockear la respuesta de una búsqueda vacía en la base de datos (simulando que no hay películas)
    (Films.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),  // Asegurarse de que devuelve un array vacío
      }),
    });
  
    // Mockear la respuesta de la API externa, simulando que devuelve estas películas
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        results: [
          { title: 'The Empire Strikes Back', episode_id: 5 },
          { title: 'The Phantom Menace', episode_id: 1 },
        ],
      },
    });
  
    // Mockear la inserción de las películas obtenidas de la API en la base de datos
    (Films.insertMany as jest.Mock).mockResolvedValue(undefined);
  
    // Mockear la segunda búsqueda en la base de datos después de insertar las películas
    (Films.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([
          { title: 'The Empire Strikes Back', episode_id: 5 },
          { title: 'The Phantom Menace', episode_id: 1 },
        ]),
      }),
    });
  
    (Films.countDocuments as jest.Mock).mockResolvedValue(2); // Simula que ahora hay 2 películas
  
    const req = { query: { page: '1', limit: '10' } } as unknown as Request; // Simula la petición con parámetros
    const res = {
      json: jest.fn(), // Mockea el método `json` del response para capturar la respuesta
      status: jest.fn().mockReturnThis(), // Mockea el método `status`
    } as unknown as Response;
  
    await getFilms(req, res); // Llama al controlador que se está probando
  
    // Verifica que se buscó primero en la base de datos
    expect(Films.find).toHaveBeenCalledWith({});
    // Verifica que se hizo la solicitud a la API externa
    expect(axios.get).toHaveBeenCalledWith('https://swapi.dev/api/films/');
    // Verifica que las películas obtenidas de la API se insertaron en la base de datos
    expect(Films.insertMany).toHaveBeenCalledWith([
      { title: 'The Empire Strikes Back', episode_id: 5 },
      { title: 'The Phantom Menace', episode_id: 1 },
    ]);
    // Verifica que se contaron las películas en la base de datos después de la inserción
    expect(Films.countDocuments).toHaveBeenCalledWith({});
    // Verifica que la respuesta JSON fue la esperada
    expect(res.json).toHaveBeenCalledWith({
      total: 2, // Total de películas tras la inserción
      currentPage: 1, // Página actual
      films: [ // Lista de películas
        { title: 'The Empire Strikes Back', episode_id: 5 },
        { title: 'The Phantom Menace', episode_id: 1 },
      ],
    });
  });
});
