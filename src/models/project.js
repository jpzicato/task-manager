import { Schema, Types, model } from 'mongoose';
import User from './user.js';
import Task from './task.js';

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

projectSchema.static('removeTask', async function (taskId) {
  const foundProjects = await this.find();

  await Promise.all(
    foundProjects.map(async project => {
      let { tasks } = project;

      tasks = tasks.map(taskId => taskId.toString());

      project.tasks = tasks.filter(task => task !== taskId);

      await project.save();
    })
  );
});

projectSchema.method('getUser', function () {
  return User.findById(this.userId);
});

projectSchema.method('getTasks', async function () {
  return Promise.all(this.tasks.map(async taskId => Task.findById(taskId)));
});

export default model('Project', projectSchema);
