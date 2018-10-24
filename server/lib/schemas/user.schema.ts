import { compare, genSalt, hash } from 'bcrypt-nodejs';
import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: 'Enter a valid username',
    unique: true
  },
  password: {
    type: String,
    required: 'Enter a valid password'
  },
  firstName: {
    type: String,

  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

UserSchema.pre('save', function (next) {
  const user: any = this;

  if (user.isModified('password') || this.isNew) {
    genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
    
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (password, cb) {
  compare(password, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};