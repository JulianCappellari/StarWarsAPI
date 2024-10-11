import axios from 'axios';
import Starships from '../models/Starships'; // Asegúrate de que el nombre del modelo sea correcto.

export const syncStarshipsData = async () => {
  try {
    console.log('Fetching starships data from API...');
    const response = await axios.get('https://swapi.dev/api/starships');
    const starshipsData = response.data.results;

    console.log(`Fetched ${starshipsData.length} starships from API.`);

    for (const starship of starshipsData) {
      console.log(`Updating or inserting starship: ${starship.name}`);
      await Starships.updateOne({ name: starship.name }, starship, { upsert: true });
    }
    console.log('Starships data synchronized');
  } catch (error) {
    console.error('Error syncing starships data:', error);
  }
};
