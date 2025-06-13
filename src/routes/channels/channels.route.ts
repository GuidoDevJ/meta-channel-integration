import { Router } from 'express';
import { ChannelController } from '../../controllers/channel.controller';
import { ChannelsService } from '../../services/channels.service';

const router = Router();
const channelController = new ChannelController(new ChannelsService());

/**
 * Ruta para generar el enlace de autenticación con Meta (OAuth).
 *
 * @route GET /channels/:type
 * @queryParam companyId {string} - ID de la empresa
 * @queryParam name {string} - Nombre del canal
 */
router.get('/', channelController.handleChannelLink);

export default router;
