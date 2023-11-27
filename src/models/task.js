import { Schema, Types, model } from 'mongoose';
import User from './user.js';
const taskSchema = new Schema(
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
    dueDate: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED'],
      default: 'PENDING',
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

taskSchema.method('getUser', function () {
  return User.findById(this.userId);
});

export default model('Task', taskSchema);
