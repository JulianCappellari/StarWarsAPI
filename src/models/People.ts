import e = require('express');
import { Schema, model } from 'mongoose';

const peopleSchema = new Schema({
  name: String,
  height: String,
  mass: String,
  hair_color: String,
  skin_color: String,
  eye_color: String,
  birth_year: String,
  gender: String,
  homeworld: { type: String },  
  films: [{ type: String }],      
  species: [String],  
  vehicles: [String], 
  starships: [{ type: String }], 
  created: String,
  edited: String,
  url: String,
});

export default model('People', peopleSchema);
