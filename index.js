import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import defaultRoutes from '#routes/defaultRoutes.js';
import listRoutes from '#routes/listRoutes.js';
import categoryRoutes from '#routes/categoryRoutes.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from '#docs/openapi.js';
import errorHandler from '#middlewares/errorHandler.js';
import runInitSql from '#config/initDb.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Rotas agrupadas
app.use('/', defaultRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Middleware
app.use(errorHandler);

(async () => {
  await runInitSql();
  app.listen(PORT, () => {
    console.log('\x1b[41m%s\x1b[0m', `Servidor rodando na porta ${PORT}`);
  });
})();
