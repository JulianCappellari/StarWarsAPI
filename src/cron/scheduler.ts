import cron from 'node-cron';
import { syncPeopleData } from '../services/syncPeople';
import { syncFilmsData } from '../services/syncFilms';
import { syncStarshipsData } from '../services/syncStarships';
import { syncPlanetsData } from '../services/syncPlanets';

console.log('Scheduler initialized.');

// Función para ejecutar la sincronización
const runSyncs = async () => {
    console.log('Running initial syncs...');
    await syncPeopleData();
    await syncFilmsData();
    await syncStarshipsData();
    await syncPlanetsData();
  };
  
  // Llama a la función de sincronización inicial al iniciar el servidor
  runSyncs();

// Sincroniza los datos de People cada 24 horas
cron.schedule('0 0 * * *', async () => {
  console.log('Running sync for People data...');
  await syncPeopleData();
});

// Sincroniza los datos de Films cada 24 horas
cron.schedule('0 0 * * *', async () => {
  console.log('Running sync for Films data...');
  await syncFilmsData();
});

// Sincroniza los datos de Starships cada 24 horas
cron.schedule('0 0 * * *', async () => {
  console.log('Running sync for Starships data...');
  await syncStarshipsData();
});

// Sincroniza los datos de Planets cada 24 horas
cron.schedule('0 0 * * *', async () => {
  console.log('Running sync for Planets data...');
  await syncPlanetsData();
});