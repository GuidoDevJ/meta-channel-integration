import { Router } from 'express';
import { metaOauthCallback } from '../../controllers/mataOauth.controller';

const router = Router();

/**
 * Ruta para manejar el callback de autenticación OAuth de Meta.
 * GET /oauth/meta/callback
 */
router.get('/oauth/meta/callback', metaOauthCallback);

export default router;
