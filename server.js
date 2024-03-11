const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const app = express();
const PORT = process.env.PORT || 3001;

// Load models
const Team = require('./models/Team');
const Vote = require('./models/Vote');

dotenv.config();

//connect to mongodb
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// USSD endpoint
app.post('/ussd', async (req, res) => {
    const { text, phoneNumber } = req.body;
    let response = '';

    const textParts = text.split('*');

    if (text === '') {
        // Initial USSD request
        response = `CON Welcome to Smart Votes Hackathon Voting\n1. Vote for a Team\n2. Check Results`;
    } else if (text === '1') {
        // Logic to fetch and display team names
        try {
            const teams = await Team.find({});
            response = 'CON Vote for a Team:\n';
            teams.forEach((team, index) => {
                response += `${index + 1}. ${team.name}\n`;
            });
        } catch (error) {
            response = 'END Failed to fetch teams';
        }
    } else if (text === '2') {
        // Logic to fetch and display results
        try {
            const voteResults = await Vote.aggregate([
                { $group: { _id: "$teamId", count: { $sum: 1 } } }
            ]);
            const teams = await Team.find({});
            let resultsString = 'END Voting Results:\n';
            teams.forEach(team => {
                const teamVote = voteResults.find(vote => vote._id === team.teamId);
                const voteCount = teamVote ? teamVote.count : 0;
                resultsString += `${team.name}: ${voteCount} votes\n`;
            });
            response = resultsString;
        } catch (error) {
            response = 'END Unable to fetch results';
        }
    } else if (text.startsWith('1*')) {
        // Logic to record vote
        const teamNumber = parseInt(text.split('*')[1], 10);
        try {
            const team = await Team.findOne({ teamId: teamNumber });
            if (!team) {
                response = `END Invalid team number`;
            } else {
                const newVote = new Vote({ teamId: team.teamId, voterPhone: phoneNumber });
                await newVote.save();
                response = `END Thank you for voting for Team ${team.name}`;
            }
        } catch (error) {
            response = `END Failed to record your vote`;
        }
    } else {
        response = 'END Invalid input. Please try again';
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

// Invalid route handler
app.use('*', (_req, res) => res.status(400).send('Invalid route. Please check your URL and try again.'));

// Start server
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
