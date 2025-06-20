import { Router } from 'express';
import { renovateToken } from '../../controllers/mataOauth.controller';

const router = Router();

/**
 * Ruta para manejar el renovate token de meta.
 * POST /oauth/renovateToken
 */
router.post('/oauth/renovate-token', renovateToken);

export default router;
