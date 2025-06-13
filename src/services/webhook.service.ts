import { AppDataSource } from '../db/db.connection';
import { MessageRepository } from '../repository/message.repository';

/**
 * Servicio encargado de procesar los eventos recibidos desde el webhook de Facebook Messenger.
 */
export class WebhookService {
  private messageRepository: MessageRepository;

  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error(
        'DataSource not initialized. Run MetaOauthService.init() first.'
      );
    }
    this.messageRepository = new MessageRepository(AppDataSource);
  }

  static async init(): Promise<WebhookService> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return new WebhookService();
  }
  /**
   * Procesa una lista de entradas (entries) recibidas desde el webhook.
   *
   * Cada entrada puede contener múltiples eventos de mensajería. En este caso
   * se toma el primer evento (`entry.messaging[0]`) y se imprime por consola.
   *
   * @param {any[]} entries - Array de objetos `entry` provenientes del webhook.
   * Cada `entry` contiene información sobre eventos de mensajería.
   *
   * @example
   * const entries = [
   *   {
   *     messaging: [
   *       {
   *         sender: { id: '123456789' },
   *         message: { text: 'Hola!' }
   *       }
   *     ]
   *   }
   * ];
   * webhookService.processEntries(entries);
   */
  public async processEntries(entries: any[], page: string): Promise<void> {
    await Promise.all(
      entries.map((entry) =>
        this.messageRepository.saveMessageFromWebhook(entry, page as any)
      )
    );
  }
}
