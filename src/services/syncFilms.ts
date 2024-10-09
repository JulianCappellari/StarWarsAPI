import axios from 'axios';
import Films from '../models/Films';

export const syncFilmsData = async () => {
  try {
    console.log('Fetching films data from API...');
    const response = await axios.get('https://swapi.dev/api/films');
    const filmsData = response.data.results;

    console.log(`Fetched ${filmsData.length} films from API.`);

    for (const film of filmsData) {
      console.log(`Updating or inserting film: ${film.title}`);
      await Films.updateOne({ title: film.title }, film, { upsert: true });
    }
    console.log('Films data synchronized');
  } catch (error) {
    console.error('Error syncing films data:', error);
  }
};
