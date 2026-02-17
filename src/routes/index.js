import express from 'express';
import defaultRoutes from './defaultRoutes.js';
import listRoutes from './listRoutes.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from '#docs/openapi.js';

const router = express.Router();

router.use('/', defaultRoutes);
router.use('/api/lists', listRoutes);
router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

export default router;
