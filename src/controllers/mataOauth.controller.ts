// src/controllers/metaOauth.controller.ts
import { NextFunction, Request, Response } from 'express';
import { MetaOauthService } from '../services/metaOauth.service';

/**
 * Controlador para manejar el callback de Meta OAuth.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @param {NextFunction} next - Función para manejar errores.
 */
const metaOauthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const metaOauthService = await MetaOauthService.init();

    const { code } = req.query as { code: string; state: string };
    const result = await metaOauthService.handleCallback(code, 'facebook');

    return res.redirect('/success');
  } catch (error) {
    next(error);
  }
};

const renovateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const metaOauthService = await MetaOauthService.init();

    const { accessToken } = req.body;
    const result = await metaOauthService.renovateLongToken(accessToken);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
export { metaOauthCallback, renovateToken };
