import { validate } from 'class-validator';
import axios from 'axios';

import { StarshipDto } from '../../dto/StarshipDto';
import Starships from '../../models/Starships';

export const syncStarshipsData = async () => {
  try {
    const response = await axios.get('https://swapi.dev/api/starships');
    const starshipsData = response.data.results;

    const validStarships = [];
    for (const starship of starshipsData) {
      const starshipDto = new StarshipDto();
      Object.assign(starshipDto, starship);

      const errors = await validate(starshipDto);
      if (errors.length > 0) {
        console.error(`Validation failed for starship: ${starship.name}`, errors);
        continue;
      }
      validStarships.push(starshipDto);
    }

    // Inserta o actualiza los datos válidos en una sola operación
    await Starships.bulkWrite(
      validStarships.map((starship) => ({
        updateOne: {
          filter: { name: starship.name },
          update: starship,
          upsert: true,
        },
      }))
    );

    console.log('Starships data synchronized');
  } catch (error) {
    console.error('Error syncing starships data:', error);
  }
};
