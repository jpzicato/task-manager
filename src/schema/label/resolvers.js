import Label from '../../models/label.js';
import Task from '../../models/task.js';
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

  Mutation: {
    addTaskToLabel: async (_, { labelId, taskId }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(labelId, Label)))
        throw genGraphQLError(
          `No label found with the id ${labelId}`,
          'LABEL_NOT_FOUND'
        );

      if (!(await validateIdAndFindModel(taskId, Task)))
        throw genGraphQLError(
          `No task found with the id ${taskId}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(taskId);

      if (foundTask.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot add the belonging of a non-own task to a label`,
          'FORBIDDEN'
        );

      const { tasks } = await Label.findById(labelId);

      const taskAlreadyBelongs = tasks.find(task => task.toString() === taskId);

      if (taskAlreadyBelongs)
        throw genGraphQLError(
          `Task id ${taskId} already belongs to label id ${labelId}`,
          'TASK_ALREADY_BELONGS'
        );

      return Label.findByIdAndUpdate(
        labelId,
        {
          tasks: [...tasks, taskId],
        },
        {
          returnDocument: 'after',
        }
      );
    },

    updateTaskFromLabel: async (_, { labelId, taskId }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(labelId, Label)))
        throw genGraphQLError(
          `No label found with the id ${labelId}`,
          'LABEL_NOT_FOUND'
        );

      if (!(await validateIdAndFindModel(taskId, Task)))
        throw genGraphQLError(
          `No task found with the id ${taskId}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(taskId);

      if (foundTask.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot update the belonging of a non-own task to a label`,
          'FORBIDDEN'
        );

      const { tasks } = await Label.findById(labelId);

      const taskAlreadyBelongs = tasks.find(task => task.toString() === taskId);

      if (taskAlreadyBelongs)
        throw genGraphQLError(
          `Task id ${taskId} already belongs to label id ${labelId}`,
          'TASK_ALREADY_BELONGS'
        );

      const taskRemoved = await Label.removeTask(taskId);

      if (!taskRemoved)
        throw genGraphQLError(
          `Task id ${taskId} does not belong to any label`,
          'TASK_DOES_NOT_BELONG_TO_ANY_LABEL'
        );

      return Label.findByIdAndUpdate(
        labelId,
        {
          tasks: [...tasks, taskId],
        },
        {
          returnDocument: 'after',
        }
      );
    },

    removeTaskFromLabel: async (_, { taskId }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(taskId, Task)))
        throw genGraphQLError(
          `No task found with the id ${taskId}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(taskId);

      if (foundTask.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot remove the belonging of a non-own task to a label`,
          'FORBIDDEN'
        );

      const taskRemoved = await Label.removeTask(taskId);

      if (!taskRemoved)
        throw genGraphQLError(
          `Task id ${taskId} does not belong to any label`,
          'TASK_DOES_NOT_BELONG_TO_ANY_LABEL'
        );

      return 'Task successfully removed from the belonging tag';
    },
  },
};
