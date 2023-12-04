import Label from '../../models/label.js';
import genGraphQLError from '../../utils/genGraphQLError.js';
import validateIdAndFindModel from '../../utils/validateIdAndFindModel.js';

export default {
  Label: {
    tasks: async (parent, _, { userId }) => parent.getTasks(userId),
  },

  Query: {
    labels: async (_, __, { error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      return Label.find();
    },

    label: async (_, { id }, { error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(id, Label)))
        throw genGraphQLError(
          `No label found with the id ${id}`,
          'LABEL_NOT_FOUND'
        );

      return await Label.findById(id);
    },
  },
};
