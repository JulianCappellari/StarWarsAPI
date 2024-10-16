import cron from 'node-cron';
import { syncPeopleData } from '../services/people/syncPeople';
import { syncFilmsData } from '../services/film/syncFilms';
import { syncStarshipsData } from '../services/starships/syncStarships';
import { syncPlanetsData } from '../services/planets/syncPlanets';


console.log('Scheduler initialized.');

const runSyncs = async () => {
  console.log('Running syncs...');
  await Promise.all([
    syncPeopleData(),
    syncFilmsData(),
    syncStarshipsData(),
    syncPlanetsData(),
  ]);
};

// Inicializa la sincronización
runSyncs();

// Cron job único para todas las sincronizaciones
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled sync...');
  await runSyncs();
});