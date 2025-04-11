const mongoose = require('mongoose');
const MODEL = require('../constants/modelNames');

// Support Message Schema
const SupportMessageSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        index: true
    },
    from: {
        type: String,
        enum: ['user', 'seller', 'system'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model(MODEL.SUPPORT_MESSAGE, SupportMessageSchema);
