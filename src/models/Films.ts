import { Schema, model } from 'mongoose';

const filmSchema = new Schema({
  title: String,
  episode_id: Number,
  opening_crawl: String,
  director: String,
  producer: String,
  release_date: String,
  characters: [{ type: String }],  
  planets: [{ type: String }],     
  starships: [{ type: String }], 
  vehicles: [String],  
  species: [String],   
  created: String,
  edited: String,
  url: String,
});

export default model('Film', filmSchema);