import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import Task from './task.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: [
        value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
        'The provided email is not a valid email',
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        value => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value),
        'The password must contain at least 8 characters including at least 1 uppercase, 1 lowercase and one number',
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre('save', async function (next) {
  const { constructor, password } = this;

  this.password = await constructor.hashPassword(password);

  next();
});

userSchema.static('hashPassword', password => bcrypt.hash(password, 16));

userSchema.static('comparePassword', (password, hash) =>
  bcrypt.compare(password, hash)
);

userSchema.method('getTasks', function () {
  return Task.find({
    userId: this._id,
  });
});

export default model('User', userSchema);
