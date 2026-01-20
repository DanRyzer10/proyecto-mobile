import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gateway API',
            version: '1.0.0',
            description: 'API documentation for the Gateway service',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/main.ts', './src/**/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
