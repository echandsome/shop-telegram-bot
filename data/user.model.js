const mongoose = require('mongoose');
const MODEL = require('../constants/modelNames');

// User Schema
const UserSchema = new mongoose.Schema({
    userId: {
      type: Number,
      required: true,
      unique: true
    },
    currentProduct: {
      type: String,
      default: null
    },
    firstName: String,
    lastName: String,
    username: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = User = mongoose.model(MODEL.USER, UserSchema);