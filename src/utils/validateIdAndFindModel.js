import { Types } from 'mongoose';

export default async (id, model) =>
  Types.ObjectId.isValid(id) && !!(await model.findById(id));
