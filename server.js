const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongooseConnect = require('./config/db');
const errorHandler = require('./middleware/error');
const colors = require('colors');

// Load in env file
dotenv.config({ path: './config/config.env' });

// Connect to mongoose server
mongooseConnect();

const leagues = require('./routes/leagues');
const teams = require('./routes/teams');
const players = require('./routes/players');

const app = express();

// Body parser
app.use(express.json());

// Mount Routers
app.use('/api/v1/leagues', leagues);
app.use('/api/v1/teams', teams);
app.use('/api/v1/players', players);

// Handle errors
app.use(errorHandler);
app.use((req, res) => {
    res.status(404).json({ success: false, data: 'URL not found' });
});

app.listen(process.env.PORT, console.log(`Server running on Port ${process.env.PORT}`));