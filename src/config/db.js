import mongoose from "mongoose";
import env from "./env.js";

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.mongodbUri);

    console.log(
      `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error.message);

    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error.message);
  }
};

export {
  connectDatabase,
  disconnectDatabase,
};