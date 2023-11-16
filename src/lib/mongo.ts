import mongoose, { Connection } from "mongoose";

let cachedDb: Connection;

const MONGO_URI = process.env.MONGO_DB_URI || "mongodb://localhost:27017/";

export const connectDB = async (): Promise<Connection> => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    console.log("Conectando a la base de datos", MONGO_URI);
    const db = await mongoose.connect(MONGO_URI);

    console.log("Conexión a la base de datos establecida");
    cachedDb = db.connection;
    return db.connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
};
