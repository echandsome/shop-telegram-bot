const mongoose = require('mongoose');
const CartItemSchema = require('./cart-item.model');
const MODEL = require('../constants/modelNames');

// Cart Schema
const CartSchema = new mongoose.Schema({
    userId: {
      type: Number,
      required: true,
      unique: true
    },
    items: [CartItemSchema],
    discountCode: {
      type: String,
      default: null
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    finalPrice: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model(MODEL.CART, CartSchema);