import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import { router } from './api';
import { DbConfig } from './configs/database';

const mongoose = require('mongoose');
const passport = require('passport');

mongoose.Promise = require('bluebird');
mongoose.connect(DbConfig.database, {promiseLibrary: require('bluebird')})
  .then(() => console.log('Successfully connected to database.'))
  .catch((err) => console.error(err));

class App {

  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(morgan('dev'));
    this.app.use(express.static(path.join(__dirname, 'dist')));
    this.app.use('/', express.static(path.join(__dirname, 'dist')));
    this.app.use('/api', router);

    this.app.use(passport.initialize());
  }

}

export default new App().app;
