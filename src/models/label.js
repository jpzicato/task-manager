import { Schema, Types, model } from 'mongoose';
import Task from './task.js';

const labelSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
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

labelSchema.method('getTasks', async function (userId) {
  const tasks = await Promise.all(
    this.tasks.map(async taskId => {
      return Task.findById(taskId);
    })
  );

  return tasks.filter(task => task.userId?.toString() === userId);
});

labelSchema.static('removeTask', async function (taskId) {
  let taskRemoved;

  const labels = await this.find();

  await Promise.all(
    labels.map(async ({ _id, tasks }) => {
      const foundTask = tasks.find(task => task.toString() === taskId);

      if (foundTask) {
        await this.findByIdAndUpdate(
          _id,
          {
            tasks: tasks.filter(task => task.toString() !== taskId),
          },
          {
            returnDocument: 'after',
          }
        );

        taskRemoved = true;
      }
    })
  );

  return taskRemoved;
});

export default model('Label', labelSchema);
