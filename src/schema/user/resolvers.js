import User from '../../models/user.js';
import Token from '../../models/token.js';
import genGraphQLError from '../../utils/genGraphQLError.js';
import envVars from '../../config/envVars.js';
import { passwordsMatchValidation } from '../../validators/auth.js';
import { updateUserValidation } from '../../validators/users.js';
import handleValidationError from '../../utils/handleValidationError.js';
import Task from '../../models/task.js';
import Project from '../../models/project.js';

const { REFRESH_TOKEN_SECRET } = envVars;

export default {
  User: {
    tasks: async parent => {
      return parent.getTasks();
    },
  },

  Query: {
    user: async (_, __, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      return User.findById(userId);
    },
  },

  Mutation: {
    signUp: async (_, { input }) => {
      const { password, repeatPassword } = input;

      const errorMsg = handleValidationError(passwordsMatchValidation, {
        password,
        repeatPassword,
      });

      if (errorMsg) {
        const { msg, code } = errorMsg;

        throw genGraphQLError(msg, code);
      }

      const { _id } = await User.create(input);

      return Token.genTokens(_id);
    },

    logIn: async (_, { input }) => {
      const { email, password } = input;

      const foundUser = await User.findOne({ email });

      if (!foundUser)
        throw genGraphQLError(
          `The provided email "${email}" does not belong to an existing user`,
          'BAD_USER_INPUT'
        );

      const { _id: userId, password: foundUserPassword } = foundUser;

      const foundToken = await Token.findOne({
        userId,
      });

      if (foundToken)
        throw genGraphQLError(
          'The user is already logged in',
          'USER_ALREADY_LOGGED_IN'
        );

      const passwordsMatch = await User.comparePassword(
        password,
        foundUserPassword
      );

      if (!passwordsMatch)
        throw genGraphQLError('Wrong password', 'BAD_USER_INPUT');

      return Token.genTokens(userId);
    },

    renewAccessToken: async (_, { input: { refreshToken } }) => {
      const userId = await Token.verifyToken(
        refreshToken,
        REFRESH_TOKEN_SECRET
      );

      const { deletedCount } = await Token.deleteOne({
        value: refreshToken,
      });

      if (!deletedCount)
        throw genGraphQLError(
          'The provided refreshToken does not belong to a user',
          'USER_NOT_FOUND'
        );

      return Token.genTokens(userId);
    },

    logOut: async (_, { input: { refreshToken } }) => {
      await Token.verifyToken(refreshToken, REFRESH_TOKEN_SECRET);

      const { deletedCount } = await Token.deleteOne({
        value: refreshToken,
      });

      if (!deletedCount)
        throw genGraphQLError(
          'The provided refreshToken does not belong to a user',
          'USER_NOT_FOUND'
        );

      return 'User successfully logged out';
    },

    updateUser: async (_, { edits }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      const { name, password } = edits;

      if (name) edits.name = name.trim();

      const errorMsg = handleValidationError(updateUserValidation, edits);

      if (errorMsg) {
        const { msg, code } = errorMsg;

        throw genGraphQLError(msg, code);
      }

      if (password) edits.password = await User.hashPassword(password);

      await Token.deleteOne({
        userId,
      });

      const updatedUser = await User.findByIdAndUpdate(userId, edits, {
        returnDocument: 'after',
        runValidators: true,
      });

      return updatedUser;
    },

    deleteUser: async (_, __, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      await Token.deleteOne({
        userId,
      });

      await User.findByIdAndDelete(userId);

      await Task.deleteMany({
        userId,
      });

      await Project.deleteMany({
        userId,
      });

      return 'User successfully deleted';
    },
  },
};
