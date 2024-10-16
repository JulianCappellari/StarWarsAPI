import { validate } from 'class-validator';
import axios from 'axios';

import { PlanetDto } from '../../dto/PlanetDto';
import Planets from '../../models/Planets';

export const syncPlanetsData = async () => {
  try {
    const response = await axios.get('https://swapi.dev/api/planets');
    const planetsData = response.data.results;

    const validPlanets = [];
    for (const planet of planetsData) {
      const planetDto = new PlanetDto();
      Object.assign(planetDto, planet);

      const errors = await validate(planetDto);
      if (errors.length > 0) {
        console.error(`Validation failed for planet: ${planet.name}`, errors);
        continue;
      }
      validPlanets.push(planetDto);
    }

    // Inserta o actualiza los datos válidos en una sola operación
    await Planets.bulkWrite(
      validPlanets.map((planet) => ({
        updateOne: {
          filter: { name: planet.name },
          update: planet,
          upsert: true,
        },
      }))
    );

    console.log('Planets data synchronized');
  } catch (error) {
    console.error('Error syncing planets data:', error);
  }
};
