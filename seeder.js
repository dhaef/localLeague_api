const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// LOAD env vars
dotenv.config({ path: './config/config.env' });

// Load models
const League = require('./models/League');
const Team = require('./models/Team');
const Player = require('./models/Player');

// Connect to DB
mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read json files
const leagues = JSON.parse(fs.readFileSync(`${__dirname}/data/leagues.json`, 'utf-8'));
const teams = JSON.parse(fs.readFileSync(`${__dirname}/data/teams.json`, 'utf-8'));
const players = JSON.parse(fs.readFileSync(`${__dirname}/data/players.json`, 'utf-8'));

// Import into DB
const importData = async () => {
    try {
        await League.create(leagues);
        // await Team.create(teams);
        await Player.create(players);

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// Delete data
const deleteData = async () => {
    try {
        await League.deleteMany();
        await Team.deleteMany();
        await Player.deleteMany();

        console.log('Data Deleted...');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData()
}