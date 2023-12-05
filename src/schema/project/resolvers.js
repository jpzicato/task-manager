import Project from '../../models/project.js';
import Task from '../../models/task.js';
import genGraphQLError from '../../utils/genGraphQLError.js';
import validateIdAndFindModel from '../../utils/validateIdAndFindModel.js';

export default {
  Project: {
    user: async parent => parent.getUser(),

    tasks: async parent => parent.getTasks(),
  },

  Query: {
    projects: async (_, __, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      return Project.find({
        userId,
      });
    },

    project: async (_, { id }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(id, Project)))
        throw genGraphQLError(
          `No project found with the id ${id}`,
          'PROJECT_NOT_FOUND'
        );

      const foundProject = await Project.findById(id);

      if (foundProject.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot see non-own projects`,
          'FORBIDDEN'
        );

      return foundProject;
    },
  },

  Mutation: {
    createProject: async (_, { project }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      const { name, description, tasks } = project;

      const foundTask = await Project.findOne({
        name,
        description,
      });

      if (foundTask)
        throw genGraphQLError(
          `A project with the same name and description already exists for user id ${userId}`,
          'CONFLICT'
        );

      if (tasks)
        await Promise.all(
          tasks.map(async taskId => {
            if (!(await validateIdAndFindModel(taskId, Task)))
              throw genGraphQLError(
                `No task found with the id ${taskId}`,
                'TASK_NOT_FOUND'
              );
          })
        );

      return Project.create({
        ...project,
        userId,
      });
    },

    updateProject: async (_, { id, edits }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(id, Project)))
        throw genGraphQLError(
          `No project found with the id ${id}`,
          'PROJECT_NOT_FOUND'
        );

      const foundProject = await Project.findById(id);

      if (foundProject.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot update non-own projects`,
          'FORBIDDEN'
        );

      const { tasks } = edits;

      if (tasks)
        await Promise.all(
          tasks.map(async taskId => {
            if (!(await validateIdAndFindModel(taskId, Task)))
              throw genGraphQLError(
                `No task found with the id ${taskId}`,
                'TASK_NOT_FOUND'
              );
          })
        );

      return await Project.findByIdAndUpdate(id, edits, {
        returnDocument: 'after',
        runValidators: true,
      });
    },

    deleteProject: async (_, { id }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(id, Project)))
        throw genGraphQLError(
          `No project found with the id ${id}`,
          'PROJECT_NOT_FOUND'
        );

      const foundProject = await Project.findById(id);

      if (foundProject.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot delete non-own projects`,
          'FORBIDDEN'
        );

      await Project.findByIdAndDelete(id);

      return 'Project successfully deleted';
    },

    addTaskToProject: async (_, { taskId, projectId }, { userId, error }) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(projectId, Project)))
        throw genGraphQLError(
          `No project found with the id ${projectId}`,
          'PROJECT_NOT_FOUND'
        );

      const foundProject = await Project.findById(projectId);

      if (foundProject.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot add a task to a non-own project`,
          'FORBIDDEN'
        );

      if (!(await validateIdAndFindModel(taskId, Task)))
        throw genGraphQLError(
          `No task found with the id ${taskId}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(taskId);

      if (foundTask.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot add a non-own task to a project`,
          'FORBIDDEN'
        );

      let { tasks } = foundProject;

      tasks = tasks.map(taskId => taskId.toString());

      if (tasks.includes(taskId))
        throw genGraphQLError(
          `Task id ${taskId} already belongs to project id ${projectId}`,
          'TASK_ALREADY_BELONGS_TO_PROJECT'
        );

      foundProject.tasks = [...tasks, taskId];

      return foundProject.save();
    },

    removeTaskFromProject: async (
      _,
      { taskId, projectId },
      { userId, error }
    ) => {
      if (error) {
        const { msg, code } = error;

        throw genGraphQLError(msg, code);
      }

      if (!(await validateIdAndFindModel(projectId, Project)))
        throw genGraphQLError(
          `No project found with the id ${projectId}`,
          'PROJECT_NOT_FOUND'
        );

      const foundProject = await Project.findById(projectId);

      if (foundProject.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot remove a task from a non-own project`,
          'FORBIDDEN'
        );

      if (!(await validateIdAndFindModel(taskId, Task)))
        throw genGraphQLError(
          `No task found with the id ${taskId}`,
          'TASK_NOT_FOUND'
        );

      const foundTask = await Task.findById(taskId);

      if (foundTask.userId?.toString() !== userId)
        throw genGraphQLError(
          `User id ${userId} cannot remove a non-own task from a project`,
          'FORBIDDEN'
        );

      let { tasks } = foundProject;

      tasks = tasks.map(taskId => taskId.toString());

      if (!tasks.includes(taskId))
        throw genGraphQLError(
          `Task id ${taskId} does not belong to project id ${projectId}`,
          'TASK_DOES_NOT_BELONG_TO_PROJECT'
        );

      foundProject.tasks = tasks.filter(task => task !== taskId);

      return foundProject.save();
    },
  },
};
