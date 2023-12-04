import { Schema, model } from 'mongoose';
import Task from './task.js';

const labelSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

labelSchema.method('getTasks', function (userId) {
  return Task.find({
    labelId: this._id,
    userId,
  });
});

export default model('Label', labelSchema);
