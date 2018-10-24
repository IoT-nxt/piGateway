import * as express from 'express';
import { Request, Response, Router } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { sign } from 'jsonwebtoken';
import { AuthController, verifyToken } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

const passport = require('passport');

export const router: Router = express.Router();

require('./configs/passport')(passport);

const userCtrl: UserController = new UserController();
const authCtrl: AuthController = new AuthController();

// const authenticate: any = passport.authenticate('jwt', {session: false});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express RESTful API');
});

router.get('/auth/me', verifyToken, authCtrl.getMe);

router.post('/auth/reset', authCtrl.changePassword);

router.post('/auth/signin', authCtrl.signin);

router.get('/users', verifyToken, userCtrl.getUsers);

router.post('/users', userCtrl.addUser);

router.put('/users/:id', verifyToken, userCtrl.updateUser);

router.get('/users/:id', verifyToken, userCtrl.getUser);

router.delete('/users/:id', verifyToken, userCtrl.deleteUser);

