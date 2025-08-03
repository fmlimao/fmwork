const swaggerJsdoc = require('swagger-jsdoc')

const HOST = process.env.HOST

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FMWork API',
      version: '1.0.0',
      description: 'Documentação da API do FMWork - Sistema de Gerenciamento Multi-tenant'
    },
    servers: [
      {
        url: `${HOST}/api/v1`,
        description: 'Servidor API v1'
      }
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/api/v1/swagger/schemas.js', // Carrega os schemas primeiro
    './src/api/v1/swagger/auth.js', // Depois carrega as rotas
    './src/api/v1/swagger/tenants.js',
    './src/api/v1/swagger/users.js' // Arquivo que vamos criar para as rotas de usuários
  ]
}

const specs = swaggerJsdoc(options)

module.exports = specs
