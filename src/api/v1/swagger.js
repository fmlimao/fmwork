const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FMWork API',
      version: '1.0.0',
      description: 'Documentação da API do FMWork - Sistema de Gerenciamento Multi-tenant',
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor API',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './src/api/v1/routes.js',
    './src/api/v1/swagger/*.js',
    './src/api/v1/swagger/schemas.js'
  ], // arquivos que contêm anotações
};

const specs = swaggerJsdoc(options);

module.exports = specs;