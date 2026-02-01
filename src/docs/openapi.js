import schemas from './components/schemas.js';
import { listPaths } from './views/listPaths.js';

const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'Market List Service API',
    version: '1.0.0',
    description: 'API para gestão de listas de compras'
  },
  components: {
    schemas,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: { ...listPaths }
};

export default openapi;