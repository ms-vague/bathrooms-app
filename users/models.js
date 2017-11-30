'user strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

UserSchema.methods.apiRepr = function () {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = (password) => {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};