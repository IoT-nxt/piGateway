import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { DbConfig } from '../configs/database';
import { UserModelInterface } from '../interfaces/user-model.interface';
import { UserModel } from '../models/user.model';
import { StatusMessage } from '../utils/response.utils';

export class AuthController {
  public signin(req: Request, res: Response): void {
    UserModel.findOne(
      {username: req.body.username},
      (err: any, user: UserModelInterface) => {
        if (err) {
          throw err;
        }

        if (!user) {
          return res
            .status(401)
            .send(
              new StatusMessage(
                false,
                'Authentication failed. Invalid username and password.'
              )
            );
        }

        // check if password matches
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            const token: string = sign({id: user.id}, DbConfig.secret, {
              expiresIn: 86400
            });

            // return the information including token as JSON
            res.json({success: true, accessToken: token});
          } else {
            res
              .status(401)
              .send(
                new StatusMessage(
                  false,
                  'Authentication failed. Invalid username and password.'
                )
              );
          }
        });
      }
    );
  }

  public changePassword(req: Request, res: Response): void {
    UserModel.findOne(
      {username: req.body.username},
      (err: any, user: UserModelInterface) => {
        if (err) {
          throw err;
        }

        if (!user) {
          return res
            .status(401)
            .send(
              new StatusMessage(
                false,
                'Authentication failed. Invalid username and password.'
              )
            );
        }

        // check if password matches
        user.comparePassword(req.body.oldPassword, (err, isMatch) => {
          if (isMatch && !err) {
            user.password = req.body.newPassword;
            user.save();

            // return the information including token as JSON
            res.json(new StatusMessage(true));
          } else {
            res
              .status(401)
              .send(
                new StatusMessage(
                  false,
                  'Authentication failed. Invalid username and password.'
                )
              );
          }
        });
      }
    );
  }

  public getMe(req: VerifiedRequest, res: Response) {
    UserModel.findById(req.userId, {password: 0}, (err, user) => {
      if (err) {
        return res
          .status(500)
          .send(
            new StatusMessage(false, 'There was a problem finding the user.')
          );
      }

      if (!user) {
        return res.status(404).send(new StatusMessage(false, 'No user found.'));
      }

      res.status(200).send(user);
    });
  }
}

export interface VerifiedRequest extends Request {
  userId: string;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send(new StatusMessage(false, 'No token provided.'));
  }

  verify(token, DbConfig.secret, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send(new StatusMessage(false, 'Failed to authenticate token.'));
    }

    (<VerifiedRequest>req).userId = decoded.id;
    next();
  });
}
