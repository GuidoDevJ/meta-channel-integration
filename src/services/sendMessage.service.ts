import axios from 'axios';

type Platform = 'facebook' | 'instagram';

export class SendMessageService {
  constructor() {}

  async sendMessage(
    recipientId: string,
    message: string,
    platform: Platform,
    token: string
  ): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${token}`;

    const body = {
      recipient: { id: recipientId },
      message: { text: message },
    };

    try {
      const res = await axios.post(url, body);
      console.log(`[${platform}] Mensaje enviado a ${recipientId}`);
    } catch (error: any) {
      console.error(
        `[${platform}] Error al enviar mensaje:`,
        error.response?.data || error.message
      );
    }
  }
}
