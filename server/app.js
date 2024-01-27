const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

module.exports = app;
