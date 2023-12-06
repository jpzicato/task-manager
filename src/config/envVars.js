import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'MONGODB_NAME',
  'PORT',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'ACCESS_TOKEN_EXPIRATION',
];

export default Object.fromEntries(
  requiredVariables.map(variable => {
    if (!process.env[variable])
      throw new Error(`Environment variable ${variable} is not set`);

    return [variable, process.env[variable]];
  })
);
