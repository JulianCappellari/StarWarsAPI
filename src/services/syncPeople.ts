import axios from 'axios';
import People from '../models/People';

export const syncPeopleData = async () => {
  try {
    console.log('Fetching people data from API...');
    const response = await axios.get('https://swapi.dev/api/people');
    const peopleData = response.data.results;

    console.log(`Fetched ${peopleData.length} people from API.`);

    for (const person of peopleData) {
      console.log(`Updating or inserting person: ${person.name}`);
      await People.updateOne({ name: person.name }, person, { upsert: true });
    }
    console.log('People data synchronized');
  } catch (error) {
    console.error('Error syncing people data:', error);
  }
};
