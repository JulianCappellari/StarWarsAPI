import express from 'express';
import { dbConexion } from './config/dbConfig';
import './cron/scheduler';
import { syncFilmsData } from './services/syncFilms';
import { syncPeopleData } from './services/syncPeople';
import { syncPlanetsData } from './services/syncPlanets';
import { syncStarshipsData } from './services/syncStarships';
import 'dotenv/config';
import router from './routes/App';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app = express();

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// Swagger 
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Star Wars',
      version: '1.0.0',
      description: 'Documentación de la API para sincronizar datos de Star Wars',
    },
    servers: [
      {
        url: 'http://localhost:3001', 
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
  await dbConexion();
  console.log('Conectada a MongoDB');

  // Llama a las funciones de sincronización manualmente para probarlas
  // await syncFilmsData(); // Puedes descomentar esto para probar la sincronización manualmente
  // await syncPeopleData();
  // await syncPlanetsData();
  // await syncStarshipsData();

  app.use(express.json()); 

  
  app.use('/api', router);

 const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

startServer();
