import { Types } from 'mongoose';

export default objectId => Types.ObjectId.isValid(objectId);
