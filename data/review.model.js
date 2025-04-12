const mongoose = require('mongoose');
const MODEL = require('../constants/modelNames');

// Review Schema
const ReviewSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        index: true
    },
    productId: {
        type: String,
        required: true,
        index: true
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: 'No comment provided'
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

module.exports = mongoose.model(MODEL.REVIEW, ReviewSchema);
