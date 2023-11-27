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
      validate: [
        {
          validator: value =>
            /^(\d{4})[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/.test(
              value
            ),
          message:
            'The date is not valid. It must be in the format YYYY-MM-DD, using - as separators',
        },
        {
          validator: value => !(value < new Date().toISOString().split('T')[0]),
          message: 'The date is not valid. Must not be before today',
        },
      ],
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
