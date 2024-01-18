import logger from './logs/logger.js';
import envVars from './config/envVars.js';
import runMongoDBConnection from './db/mongodb.js';
import httpServer from './server.js';
import runSeed from './seed/index.js';

const runApp = async () => {
  await runMongoDBConnection();

  await new Promise(resolve =>
    httpServer.listen(
      {
        port: 8080,
      },
      resolve
    )
  );

  logger.info(`Server listening on URL http://localhost:${envVars.HOST_PORT}`);

  await runSeed();
};

runApp();
