import { Document } from 'mongoose';
import { UserInterface } from './user.interface';

export interface UserModelInterface extends UserInterface, Document {
  comparePassword(password: string, callback: Function): void;
}