import mongoose from 'mongoose';

export const dbConexion = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/StarWarsDB');
    console.log('DB conectada correctamente');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('No se pudo inicializar la base de datos');
  }
};
