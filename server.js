const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongooseConnect = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const colors = require('colors');

// Load in env file
dotenv.config({ path: './config/config.env' });

// Connect to mongoose server
mongooseConnect();

const leagues = require('./routes/leagues');
const teams = require('./routes/teams');
const players = require('./routes/players');
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// Mount Routers
app.use('/api/v1/leagues', leagues);
app.use('/api/v1/teams', teams);
app.use('/api/v1/players', players);
app.use('/api/v1/auth', auth);

// Handle errors
app.use(errorHandler);
app.use((req, res) => {
    res.status(404).json({ success: false, data: 'URL not found' });
});

app.listen(process.env.PORT, console.log(`Server running on Port ${process.env.PORT}`));