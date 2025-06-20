import { Request, Response } from 'express';
import { SendMessageService } from '../services/sendMessage.service';

export class SendMessageController {
  sendMessage = async (req: Request, res: Response) => {
    const messageService = await SendMessageService.init();

    const { recipientId, message, platform, templateName, type, url } =
      req.body;
    const { companyId } = req.query;
    if (!['facebook', 'instagram', 'whatsapp'].includes(platform)) {
      return res.status(400).json({ error: 'Plataforma inválida' });
    }
    try {
      await messageService.sendMessage({
        recipientId,
        messageType: type,
        content: message,
        platform,
        companyId,
        templateName,
        url,
      });
      return res.status(200).json({ success: true, platform, recipientId });
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: 'Error al enviar el mensaje', details: err.message });
    }
  };
}
