import Task from '../../models/task.js';
import genGraphQLError from '../../utils/genGraphQLError.js';
import validateObjectId from '../../utils/validateObjectId.js';

export default {
  Task: {
    user: async parent => parent.getUser(),
  },

  Query: {
    tasks: async (_, __, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      return Task.find({ userId });
    },

    task: async (_, { id }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!validateObjectId(id) || !(await Task.findById(id)))
        throw genGraphQLError(
          `No task found with the id ${id}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(id);

      if (foundTask.userId.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot see non-own tasks`,
          'FORBIDDEN'
        );

      return foundTask;
    },
  },

  Mutation: {
    createTask: async (_, { task }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      const { name, description, dueDate } = task;

      const foundTask = await Task.findOne({
        name,
        description,
        dueDate,
        userId,
      });

      if (foundTask)
        throw genGraphQLError(
          `A task with the same name, description and due date already exists for user id ${userId}`,
          'CONFLICT'
        );

      return Task.create({
        ...task,
        userId,
      });
    },

    updateTask: async (_, { id, edits }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!validateObjectId(id) || !(await Task.findById(id)))
        throw genGraphQLError(
          `No task found with the id ${id}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(id);

      if (foundTask.userId.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot update non-own tasks`,
          'FORBIDDEN'
        );

      return await Task.findByIdAndUpdate(id, edits, {
        returnDocument: 'after',
        runValidators: true,
      });
    },

    deleteTask: async (_, { id }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!validateObjectId(id) || !(await Task.findById(id)))
        throw genGraphQLError(
          `No task found with the id ${id}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(id);

      if (foundTask.userId.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot delete non-own tasks`,
          'FORBIDDEN'
        );

      await Task.findByIdAndDelete(id);

      return 'Task successfully deleted';
    },
  },
};
