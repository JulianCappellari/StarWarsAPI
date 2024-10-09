import mongoose from 'mongoose';

export const dbConexion = async (): Promise<void> => {
  try {
    const dbUrl = process.env.CONNEXION_MONGOSE;
    
    if (!dbUrl) {
      throw new Error('La variable de entorno CONNEXION_MONGOSE no está definida');
    }

    console.log(dbUrl)
    await mongoose.connect(dbUrl);
    console.log('DB conectada correctamente');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('No se pudo inicializar la base de datos');
  }
};
