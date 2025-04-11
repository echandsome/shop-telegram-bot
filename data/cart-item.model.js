const mongoose = require('mongoose');

// Cart Item Schema
const CartItemSchema = new mongoose.Schema({
    product: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = CartItemSchema;