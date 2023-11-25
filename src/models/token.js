import { Schema, model, Types } from 'mongoose';
import genToken from '../utils/genToken.js';
import Token from './token.js';
import jwt from 'jsonwebtoken';

const tokenSchema = new Schema(
  {
    value: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tokenSchema.static('genTokens', async userId => {
  const accessToken = genToken(userId, true);
  const refreshToken = genToken(userId);

  await Token.create({
    value: refreshToken,
    userId,
  });

  return {
    accessToken,
    refreshToken,
  };
});

tokenSchema.static('verifyToken', (token, secret) => {
  const { userId } = jwt.verify(token, secret);

  return userId;
});

export default model('Token', tokenSchema);
