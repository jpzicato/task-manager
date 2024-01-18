import Label from '../models/label.js';
import labels from './labels.js';
import logger from '../logs/logger.js';

const createCollection = async ({ name, data }, model) => {
  try {
    const modelCount = await model.countDocuments();

    if (modelCount) return;

    await Promise.all(data.map(async element => await model.create(element)));

    logger.info(`${name} collection created`);
  } catch (error) {
    const errorMsg = `${name} collection seeding failed: ${error}`;

    logger.error(errorMsg);

    throw errorMsg;
  }
};

export default () => createCollection(labels, Label);
