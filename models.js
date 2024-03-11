import mongoose from "mongoose";

// Define Schemas
const TeamSchema = new mongoose.Schema({
    teamId: String,
    name: String
});

const VoteSchema = new mongoose.Schema({
    teamId: String,
    voterPhone: String,
    timestamp: { type: Date, default: Date.now }
});

// Create Models
const Team = mongoose.model('Team', TeamSchema);
const Vote = mongoose.model('Vote', VoteSchema);

// const teams = [
//     { teamId: '1', name: 'Team A' },
//     { teamId: '2', name: 'Team B' },
//     { teamId: '3', name: 'Team C' }
// ];

// // Insert sample teams into MongoDB
// Team.insertMany(teams)
//     .then(() => {
//         console.log('Sample teams inserted successfully');
//     })
//     .catch(err => {
//         console.error('Error inserting sample teams:', err);
//     });
    