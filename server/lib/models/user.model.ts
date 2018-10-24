import { Model, model } from 'mongoose';
import { UserModelInterface } from '../interfaces/user-model.interface';
import { UserSchema } from '../schemas/user.schema';

export const UserModel: Model<UserModelInterface> = model('User', UserSchema);
