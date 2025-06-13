import { Router } from 'express';
import { SendMessageController } from '../../controllers/sendMessages.controller';
const router = Router();

const controller = new SendMessageController();

// Instanciamos el servicio

/**
 * @route POST /send-message
 * @group Messages - Envío de mensajes a Facebook o Instagram
 * @param {SendMessageRequest.model} body.body.required - Información del mensaje
 * @returns {object} 200 - Mensaje enviado correctamente
 * @returns {Error}  default - Error al enviar el mensaje
 * @example request - Enviar mensaje a Facebook
 * {
 *   "recipientId": "123456789",
 *   "message": "Hola desde el bot!",
 *   "platform": "facebook"
 * }
 * @example request - Enviar mensaje a Instagram
 * {
 *   "recipientId": "987654321",
 *   "message": "Hola desde IG!",
 *   "platform": "instagram"
 * }
 */

router.post('/sendMessage', controller.sendMessage as any);

export default router;
