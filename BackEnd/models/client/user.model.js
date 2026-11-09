const mongoose = require('mongoose');
const generateHelper = require('../../helpers/generate');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokenUser: {
      type: String,
      default: () => generateHelper.generateRandomString(30),
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      default: 'client',
    },
    status: {
      type: String,
      default: 'active',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema, 'users');
