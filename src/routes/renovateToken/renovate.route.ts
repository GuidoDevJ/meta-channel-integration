import { Router } from 'express';
import { renovateToken } from '../../controllers/mataOauth.controller';

const router = Router();

/**
 * Ruta para manejar el renovate token de meta.
 * POST /oauth/renovaToken
 */
router.post('/oauth/renovaToken', renovateToken);

export default router;
