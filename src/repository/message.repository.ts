import { DataSource, Repository } from 'typeorm';
import { MessageEntity } from '../entity/message.entity';

export class MessageRepository {
  private repository: Repository<MessageEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(MessageEntity);
  }

  /**
   * Guarda un mensaje recibido desde una plataforma soportada ('page' | 'instagram' | 'whatsApp').
   *
   * @param entry Objeto individual de entrada desde el webhook
   * @param platform Plataforma desde la cual proviene el mensaje
   * @returns Mensaje guardado en base de datos
   * @throws Error si el formato no es soportado o falta información esencial
   */
  public async saveMessageFromWebhook(
    entry: any,
    platform: 'page' | 'instagram' | 'whatsapp_business_account'
  ): Promise<MessageEntity> {
    const data = this.transformEntryToMessage(entry, platform);
    try {
      return await this.repository.save(data);
    } catch (err) {
      console.error('Error al guardar el mensaje:', err);
      throw new Error('No se pudo guardar el mensaje en la base de datos');
    }
  }

  /**
   * Transforma un objeto de entrada desde un webhook en una entidad de mensaje lista para guardar.
   *
   * @param entry Objeto de entrada del webhook
   * @param platform Plataforma del mensaje
   * @returns Objeto parcial con los datos de MessageEntity
   */
  private transformEntryToMessage(
    entry: any,
    platform: 'page' | 'instagram' | 'whatsapp_business_account'
  ): Partial<MessageEntity> {
    console.log(entry.messaging[0])
    switch (platform) {
      case 'page': {
        const msg = entry?.messaging?.[0];
        return {
          platform,
          senderId: msg.sender?.id,
          recipientId: msg.recipient?.id,
          timestamp: new Date(msg.timestamp),
          messageId: msg.message?.mid,
          text: msg.message?.text ?? null,
          isEcho: msg.message?.is_echo ?? false,
          appId: msg.message?.app_id ?? null,
          raw: entry,
        };
      }

      case 'instagram': {
        const msg = entry?.messaging?.[0];
        return {
          platform,
          senderId: msg.sender?.id,
          recipientId: msg.recipient?.id,
          timestamp: new Date(Number(msg.timestamp)),
          messageId: msg.message?.mid,
          text: msg.message?.text ?? null,
          isEcho: false,
          raw: entry,
        };
      }

      case 'whatsapp_business_account': {
        const msg = entry?.changes?.[0]?.value;
        return {
          platform,
          senderId: msg.contacts[0]?.wa_id,
          recipientId: msg.metadata?.phone_number_id,
          timestamp: new Date(Number(msg.messages[0].timestamp) * 1000),
          messageId: msg.message?.id,
          text: msg.messages[0]?.text.body ?? null,
          isEcho: false,
          raw: entry,
        };
      }

      default:
        throw new Error(`Plataforma no soportada: ${platform}`);
    }
  }
}
