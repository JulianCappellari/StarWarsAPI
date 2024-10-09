import { Schema, model } from 'mongoose';

const planetSchema = new Schema({
  name: String,
  rotation_period: String,
  orbital_period: String,
  diameter: String,
  climate: String,
  gravity: String,
  terrain: String,
  surface_water: String,
  population: String,
  residents: [{ type: String }],  
  films: [{ type: String }],        
  created: String,
  edited: String,
  url: String,
});

export default model('Planet', planetSchema);
