import { UserModel } from '../models/user.model';
import { DbConfig } from './database';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function (passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: DbConfig.secret,
    
  };

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    UserModel.findOne({id: jwt_payload.id}, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};