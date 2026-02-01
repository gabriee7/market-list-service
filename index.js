import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from '#routes/index.js';
import listRoutes from '#routes/listRoutes.js';
import errorHandler from '#middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from '#docs/openapi.js';
import runInitSql from '#config/initDb.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Rotas agrupadas
app.use(routes);
app.use('/api/lists', listRoutes);

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Middleware
app.use(errorHandler);

(async () => {
  await runInitSql();
  app.listen(PORT, () => {
    console.log('\x1b[41m%s\x1b[0m', `Servidor rodando na porta ${PORT}`);
  });
})();
