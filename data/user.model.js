const mongoose = require('mongoose');
const MODEL = require('../constants/modelNames');

// User Schema
const UserSchema = new mongoose.Schema({
    userId: {
      type: Number,
      required: true,
      unique: true
    },
    username: String,
    firstName: String,
    lastName: String,
    state: {
      type: String,
      default: 'main_menu'
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    currentProduct: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    orders: {
      type: Array,
      default: []
    },
    reviews: {
      type: Array,
      default: []
    }
});

module.exports = User = mongoose.model(MODEL.USER, UserSchema);