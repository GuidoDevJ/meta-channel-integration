// controllers/webhook.controller.ts
import { Request, Response } from 'express';
import { WebhookService } from '../services/webhook.service';

const VERIFY_TOKEN = 'guido_token';

export class WebhookController {
  public verifyWebhook(req: Request, res: Response) {
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

  public async handleWebhookEvent(req: Request, res: Response) {
    const webhookService = await WebhookService.init();

    const body = req.body;
    const page = body.object
    webhookService.processEntries(body.entry,page);
    res.status(200).send('EVENT_RECEIVED');
  }
}
