import { Schema, model } from 'mongoose';

const starshipSchema = new Schema({
  name: String,
  model: String,
  manufacturer: String,
  cost_in_credits: String,
  length: String,
  max_atmosphering_speed: String,
  crew: String,
  passengers: String,
  cargo_capacity: String,
  consumables: String,
  hyperdrive_rating: String,
  MGLT: String,
  starship_class: String,
  pilots: [{ type: String }],  
  films: [{ type: String }],     
  created: String,
  edited: String,
  url: String,
});

export default model('Starship', starshipSchema);