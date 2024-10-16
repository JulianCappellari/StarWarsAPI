  // DTO para validar películas
import { validate } from 'class-validator';

import axios from 'axios';
import Films from '../../models/Films';
import { FilmsDto } from '../../dto/FilmDto';

export const syncFilmsData = async () => {
  try {
    console.log('Fetching films data from API...');
    const response = await axios.get('https://swapi.dev/api/films');
    const filmsData = response.data.results;

    console.log(`Fetched ${filmsData.length} films from API.`);

    const validFilms = [];
    for (const film of filmsData) {
      const filmDto = new FilmsDto();
      Object.assign(filmDto, film);

      const errors = await validate(filmDto);
      if (errors.length > 0) {
        console.error(`Validation failed for film: ${film.title}`, errors);
        continue;
      }
      validFilms.push(filmDto);
    }

    // Inserta o actualiza los datos válidos en una sola operación
    await Films.bulkWrite(
      validFilms.map((film) => ({
        updateOne: {
          filter: { title: film.title },
          update: film,
          upsert: true,
        },
      }))
    );

    console.log('Films data synchronized');
  } catch (error) {
    console.error('Error syncing films data:', error);
  }
};
