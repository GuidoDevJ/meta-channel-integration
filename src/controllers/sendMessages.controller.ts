import { Request, Response } from 'express';
import { SendMessageService } from '../services/sendMessage.service';

export class SendMessageController {
  private readonly messageService: SendMessageService;

  constructor() {
    this.messageService = new SendMessageService();
  }

  sendMessage = async (req: Request, res: Response) => {
    const { recipientId, message, platform, token } = req.body;
    if (!['facebook', 'instagram'].includes(platform)) {
      return res.status(400).json({ error: 'Plataforma inválida' });
    }

    try {
      await this.messageService.sendMessage(
        recipientId,
        message,
        platform,
        token as string
      );
      return res.status(200).json({ success: true, platform, recipientId });
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: 'Error al enviar el mensaje', details: err.message });
    }
  };
}
