// models/Vote.js
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    teamId: String,
    voterPhone: String,
    timestamp: { type: Date, default: Date.now }
});

VoteSchema.index({ teamId: 1, voterPhone: 1 }, { unique: true });

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
