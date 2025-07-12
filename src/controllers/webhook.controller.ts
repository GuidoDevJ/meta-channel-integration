import { Request, Response } from 'express';
import { VERIFY_TOKEN } from '../consts';
import { WebhookService } from '../services/webhook.service';

export class WebhookController {
  /**
   * Verifica el webhook de Meta (Facebook, Instagram o WhatsApp Business).
   * Este método es utilizado por Meta para validar que el endpoint es válido
   * mediante un token previamente acordado.
   *
   * @param {Request} req - Objeto de solicitud HTTP de Express.
   * @param {Response} res - Objeto de respuesta HTTP de Express.
   * @returns {void}
   */
  public verifyWebhook(req: Request, res: Response): void {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verificado');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }

  /**
   * Maneja eventos entrantes enviados por Meta desde Facebook, Instagram o WhatsApp.
   * Este método recibe notificaciones de nuevos mensajes u otras actualizaciones
   * y delega su procesamiento al servicio correspondiente.
   *
   * @param {Request} req - Objeto de solicitud HTTP con el payload enviado por Meta.
   * @param {Response} res - Objeto de respuesta HTTP de Express.
   * @returns {Promise<void>}
   */
  public async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    const webhookService = await WebhookService.init();
    const body = req.body;
    const page = body.object;
    webhookService.processEntries(body.entry, page);

    res.status(200).send('EVENT_RECEIVED');
  }
}
