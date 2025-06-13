import express from 'express';
import { WebhookController } from '../../controllers/webhook.controller';

const router = express.Router();
const webhookController = new WebhookController();

router.get('/webhook', webhookController.verifyWebhook.bind(webhookController));
router.post(
  '/webhook',
  webhookController.handleWebhookEvent.bind(webhookController)
);

export default router;
