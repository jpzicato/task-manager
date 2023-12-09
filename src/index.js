import logger from './logs/logger.js';
import envVars from './config/envVars.js';

import './db/mongodb.js';
import './server.js';
import './seed/index.js';

logger.info(`Server listening on URL http://localhost:${envVars.HOST_PORT}/`);
