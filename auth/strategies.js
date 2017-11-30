'use strict';
const { Strategy: LocalStrategy} = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');

//  new LocalStrategy is a constructor
const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if(!user) {
        // return a rejected promise so we break out of .then chains
        // any errors like this will be handled in the catch block
        return Promise.reject({
          reason: 'Login Error',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'Login Error',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(error => {
      if (error.reason === 'Login Error') {
        return callback(null, false, error);
      }
      return callback(error, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // only allow HS256 tokens - then same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };