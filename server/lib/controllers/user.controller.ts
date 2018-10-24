import { Request, Response } from 'express';
import { UserModelInterface } from '../interfaces/user-model.interface';
import { UserModel } from '../models/user.model';
import { StatusMessage } from '../utils/response.utils';

export class UserController {
  public addUser(req: Request, res: Response): Response {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .send(
          new StatusMessage(false, 'Invalid username or password provided.')
        );
    }

    UserModel.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    }, (err, user: UserModelInterface) => {
      if (err) {
        return res
          .status(400)
          .send(new StatusMessage(false, err));
      }

      return res.status(200).send(new StatusMessage(true, 'User added successfully.'));
    })
  }

  public getUsers(req: Request, res: Response): void {

    UserModel.find({}, {password: 0}, (err: any, users: UserModelInterface[]) => {
      if (err) {
        throw err;
      }

      if (!users) {
        res.status(401).send(new StatusMessage(false, 'No users found.'));
        return [];
      }

      res.json({
        success: true,
        users: users.map(user => {
          return {
            _id: user._id,
            username: user.username
          };
        })
      });
    });
  }

  public deleteUser(req: Request, res: Response): void {

    UserModel.findOneAndDelete({_id: req.params.id}, (err: any) => {
      if (err) {
        throw err;
      }
      res.json({success: true});
    });
  }

  public updateUser(req: Request, res: Response): void {

    UserModel.findOneAndUpdate(
      {_id: req.params.id},
      req.body,
      {new: true},
      (err: any, user: UserModelInterface) => {
        if (err) {
          throw err;
        }
        res.json({success: true, user});
      }
    );
  }

  public getUser(req: Request, res: Response): void {

    UserModel.findOne(
      {_id: req.params.id},
      {password: 0},
      (err: any, user: UserModelInterface) => {
        if (err) {
          throw err;
        }

        if (!user) {
          res.status(401).send(new StatusMessage(false, 'User not found.'));
          return;
        }

        res.json({success: true, user: user});
      }
    );
  }
}
