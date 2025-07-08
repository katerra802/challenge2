require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const viewEngine = require('./configs/viewEngine');
const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || 'localhost';
const connection = require('./configs/database');
const swaggerSpec = require('./swagger');
const swaggerUi = require('swagger-ui-express');

viewEngine(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        defaultModelsExpandDepth: -1,
        defaultModelRendering: "example",
        tryItOutEnabled: true // bật mặc định
    }
}));

//api route
app.use('/', webRouter);

//web route
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