import axios from 'axios';

type Platform = 'facebook' | 'instagram' | 'whatsapp';
type MessageType = 'text' | 'image' | 'document';

interface SendMessageOptions {
  recipientId: string;
  messageType: MessageType;
  content: string; // texto o URL del archivo
  platform: Platform;
  token: string;
}
export class SendMessageService {
  constructor() {}
  getSendMessageUrl(
    platform: Platform,
    bussinessId: string,
    token: string
  ): string {
    const bussinesIdTest = '695762140281400';
    if (platform === 'whatsapp') {
      return `https://graph.facebook.com/v18.0/${bussinesIdTest}/messages`;
    }
    return `https://graph.facebook.com/v18.0/me/messages?access_token=${token}`;
  }
  buildMessagePayload(
    platform: Platform,
    messageType: MessageType | 'template',
    content: string,
    recipientId: string
  ): any {
    switch (platform) {
      case 'facebook':
      case 'instagram': {
        const recipient = { id: recipientId };

        if (messageType === 'text') {
          return {
            recipient,
            message: { text: content },
          };
        }

        const attachmentType = messageType === 'image' ? 'image' : 'file';

        return {
          recipient,
          message: {
            attachment: {
              type: attachmentType,
              payload: {
                url: content,
                is_reusable: true,
              },
            },
          },
        };
      }

      case 'whatsapp': {
        const base: any = {
          messaging_product: 'whatsapp',
          to: recipientId,
          type: 'template',
          template: {
            name: 'hello_world', // se espera el nombre de la plantilla como string
            language: {
              code: 'en_US', // podría parametrizarse si querés
            },
          },
        };

        // switch (messageType) {
        //   case 'text':
        //     base.text = { body: content };
        //     break;

        //   case 'image':
        //     base.image = { link: content };
        //     break;

        //   case 'document':
        //     base.document = { link: content };
        //     break;

        //   case 'template':
        //     base.template = {
        //       name: 'hello_word', // se espera el nombre de la plantilla como string
        //       language: {
        //         code: 'en_US', // podría parametrizarse si querés
        //       },
        //     };
        //     break;
        // }

        return base;
      }

      default:
        throw new Error(`Plataforma no soportada: ${platform}`);
    }
  }

  async sendMessage(options: SendMessageOptions): Promise<void> {
    const { platform, recipientId, token, messageType, content } = options;

    try {
      const url = this.getSendMessageUrl(platform, recipientId, token);
      const body = this.buildMessagePayload(
        platform,
        messageType,
        content,
        recipientId
      );

      const headers =
        platform === 'whatsapp'
          ? { Authorization: `Bearer ${token}` }
          : undefined;
      console.log(body);
      await axios.post(url, body, { headers });

      console.log(
        `[${platform}] Mensaje ${messageType} enviado a ${recipientId}`
      );
    } catch (error: any) {
      console.error(
        `[${platform}] Error al enviar ${messageType}:`,
        error.response?.data || error.message
      );
    }
  }
}
