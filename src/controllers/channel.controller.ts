import { Request, Response } from 'express';
import { ChannelsService } from '../services/channels.service';

/**
 * Controlador que maneja operaciones relacionadas con canales (Meta: WhatsApp, Instagram, Facebook).
 */
export class ChannelController {
  constructor(private readonly channelService: ChannelsService) {}

  /**
   * Maneja la creación de un enlace de canal Meta (OAuth).
   *
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  public handleChannelLink = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { companyId } = req.query;

    try {
      const url = await this.channelService.createMetaChannel(
        companyId as string
      );

      res.redirect(url);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  };
}
