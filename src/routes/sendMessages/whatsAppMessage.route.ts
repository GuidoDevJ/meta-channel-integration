import { Router } from 'express';
import { SendMessageController } from '../../controllers/sendMessages.controller';
const router = Router();

const controller = new SendMessageController();
/**
 * Enviar una plantilla de mensaje de WhatsApp utilizando el token de acceso.
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 *
 * @example
 * POST /whatsapp/send-message
 * {
 *   "token": "ACCESS_TOKEN",
 *   "receiverId": "543794143341",
 *   "templateName": "hello_world",
 *   "platform": "whatsapp"
 * }
 */
router.post('/whatsapp/send-message/:companyId', controller.sendMessage as any);

export default router;
