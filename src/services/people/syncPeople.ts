
import { validate } from 'class-validator';

import axios from 'axios';
import People from '../../models/People';
import { PeopleDto } from '../../dto/PeopleDto';

export const syncPeopleData = async () => {
  try {
    const response = await axios.get('https://swapi.dev/api/people');
    const peopleData = response.data.results;

    const validPeople = [];
    for (const person of peopleData) {
      const personDto = new PeopleDto();
      Object.assign(personDto, person);

      const errors = await validate(personDto);
      if (errors.length > 0) {
        console.error(`Validation failed for person: ${person.name}`, errors);
        continue;
      }
      validPeople.push(personDto);
    }

    // Inserta o actualiza los datos válidos en una sola operación
    await People.bulkWrite(
      validPeople.map((person) => ({
        updateOne: {
          filter: { name: person.name },
          update: person,
          upsert: true,
        },
      }))
    );

    console.log('People data synchronized');
  } catch (error) {
    console.error('Error syncing people data:', error);
  }
};
