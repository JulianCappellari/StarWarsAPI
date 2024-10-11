import express from 'express';
import { dbConexion } from './config/dbConfig';
import './cron/scheduler';
import { syncFilmsData } from './services/syncFilms';
import { syncPeopleData } from './services/syncPeople';
import { syncPlanetsData } from './services/syncPlanets';
import { syncStarshipsData } from './services/syncStarships';
import 'dotenv/config';
import router from './routes/App';


const app = express();

const startServer = async () => {
  await dbConexion();
  console.log('Connected to MongoDB');

  // Llama a las funciones de sincronización manualmente para probarlas
  // await syncFilmsData(); // Puedes descomentar esto para probar la sincronización manualmente
  // await syncPeopleData();
  // await syncPlanetsData();
  // await syncStarshipsData();

  app.use(express.json()); 

  
  app.use('/api', router);


  app.listen(3001, () => {
    console.log('Servidor corriendo en el puerto 3000');
  });
};

startServer();
