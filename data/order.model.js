const mongoose = require('mongoose');
const CartItemSchema = require('./cart-item.model');
const MODEL = require('../constants/modelNames');

// Order Schema
const OrderSchema = new mongoose.Schema({
    userId: {
      type: Number,
      required: true
    },
    items: [CartItemSchema],
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      type: String,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model(MODEL.ORDER, OrderSchema);