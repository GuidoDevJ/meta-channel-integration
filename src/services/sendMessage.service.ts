import axios from 'axios';
import { AppDataSource } from '../db/db.connection';
import { CompanyRepository } from '../repository/company.repository';

type Platform = 'facebook' | 'instagram' | 'whatsapp';
type MessageType = 'text' | 'image' | 'document';

interface SendMessageOptions {
  recipientId: string;
  messageType: MessageType;
  content: string; // texto o URL del archivo
  platform: Platform;
  companyId: any;
  url?: string;
  templateName?: string;
}

export class SendMessageService {
  private companyRepository: CompanyRepository;

  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error(
        'DataSource not initialized. Run MetaOauthService.init() first.'
      );
    }
    this.companyRepository = new CompanyRepository(AppDataSource);
  }

  static async init(): Promise<SendMessageService> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return new SendMessageService();
  }
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
    recipientId: string,
    templateName?: string,
    fileName?: string,
    url?: string
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
                url: url,
                is_reusable: true,
              },
            },
          },
        };
      }

      case 'whatsapp': {
        const base = {
          messaging_product: 'whatsapp',
          to: recipientId,
        };

        if (messageType === 'text') {
          console.log(content);
          return {
            messaging_product: 'whatsapp',
            to: recipientId,
            type: 'text',
            text: {
              body: content,
            },
          };
        }

        if (messageType === 'image') {
          return {
            ...base,
            type: 'image',
            image: {
              link: content,
            },
          };
        }

        if (messageType === 'document') {
          return {
            ...base,
            type: 'document',
            document: {
              link: content,
              filename: fileName || 'document.pdf',
            },
          };
        }

        if (messageType === 'template') {
          if (!templateName) {
            throw new Error(
              'Template name is required for WhatsApp template messages'
            );
          }
          console.log(base);
          return {
            ...base,
            type: 'template',
            template: {
              name: templateName,
              language: {
                code: 'en_US',
              },
            },
          };
        }

        throw new Error(
          `Tipo de mensaje no soportado para WhatsApp: ${messageType}`
        );
      }

      default:
        throw new Error(`Plataforma no soportada: ${platform}`);
    }
  }

  async sendMessage(options: SendMessageOptions): Promise<void> {
    const {
      platform,
      recipientId,
      messageType,
      content,
      companyId,
      templateName,
      url: pdfImageUrl,
    } = options;
    const company = await this.companyRepository.findByBusinessId(companyId);
    const token = company?.companyAccessToken as string;
    try {
      const url = this.getSendMessageUrl(platform, recipientId, token);
      const body = this.buildMessagePayload(
        platform,
        messageType,
        content,
        recipientId,
        templateName as string,
        '',
        pdfImageUrl
      );

      const headers =
        platform === 'whatsapp'
          ? { Authorization: `Bearer ${token}` }
          : undefined;
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
