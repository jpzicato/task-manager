import mongoose from 'mongoose';
import envVars from '../config/envVars.js';
import logger from '../logs/logger.js';

const { connect, connection } = mongoose;

export default async () => {
  try {
    await connect(`mongodb://mongodb:27017/${envVars.MONGODB_NAME}`);

    connection.on('error', error => {
      throw error;
    });

    logger.info('Connected to MongoDB');
  } catch (error) {
    const errorMsg = `Error connecting to MongoDB: ${error}`;

    logger.error(errorMsg);

    throw errorMsg;
  }
};
