// models/Team.js
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamId: String,
    name: String
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;
