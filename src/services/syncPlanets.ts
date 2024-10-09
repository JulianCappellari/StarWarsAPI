import axios from 'axios';
import Planets from '../models/Planets';

export const syncPlanetsData = async () => {
  try {
    console.log('Fetching planets data from API...');
    const response = await axios.get('https://swapi.dev/api/planets');
    const planetsData = response.data.results;

    console.log(`Fetched ${planetsData.length} planets from API.`);

    for (const planet of planetsData) {
      console.log(`Updating or inserting planet: ${planet.name}`);
      await Planets.updateOne({ name: planet.name }, planet, { upsert: true });
    }
    console.log('Planets data synchronized');
  } catch (error) {
    console.error('Error syncing planets data:', error);
  }
};
