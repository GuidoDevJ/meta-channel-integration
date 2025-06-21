import { Router } from 'express';
import { deleteCompany } from '../../controllers/deleteSessionMeta.controller';

const router = Router();

/**
 * Ruta para manejar el renovate token de meta.
 * POST /oauth/renovateToken
 */
router.delete('/delete/:companyId', deleteCompany as any);

export default router;
