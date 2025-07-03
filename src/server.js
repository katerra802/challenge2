require('dotenv').config();
const express = require('express');
const mongooes = require('mongoose');
const path = require('path');
const viewEngine = require('./configs/viewEngine');
const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || 'localhost';
const connection = require('./configs/database');
const session = require('express-session');

viewEngine(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use('/', webRouter);
app.use('/v1/api', apiRouter);

const startServer = async () => {
    try {
        await connection();
        app.listen(PORT, HOST_NAME, () => {
            console.log(`Server is running on http://${HOST_NAME}:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
}



startServer();