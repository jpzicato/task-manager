import User from '../models/user.js';
import Token from '../models/token.js';
import envVars from '../config/envVars.js';

export default async (req, _, next) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      req.error = {
        msg: 'Access token needed',
        code: 'UNAUTHORIZED',
      };

      return next();
    }

    const userId = await Token.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      req.error = {
        msg: 'The access token does not belong to a user',
        code: 'UNAUTHORIZED',
      };

      return next();
    }

    req.userId = foundUser.id;

    next();
  } catch ({ message, code }) {
    req.error = {
      msg: message,
      code: 'JSON_WEB_TOKEN_ERROR',
    };

    next();
  }
};
