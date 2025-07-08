const swaggerJSDOC = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Challenge 5',
            version: '1.0.0',
            description: 'API documentation for Challenge 5',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },

        ],
    },
    apis: ['./src/routes/api.js'], // Path to the API docs
}

const swaggerSpec = swaggerJSDOC(options);

module.exports = swaggerSpec;