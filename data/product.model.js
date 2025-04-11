const mongoose = require('mongoose');
const MODEL = require('../constants/modelNames');

// Product Schema
const ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    stock: {
        type: Number,
        default: 999 // Unlimited stock by default
    },
    image: {
        type: String,
        default: null
    },
    options: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(MODEL.PRODUCT, ProductSchema);
