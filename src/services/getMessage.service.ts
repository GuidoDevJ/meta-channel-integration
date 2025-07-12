import { Repository } from 'typeorm';
import { AppDataSource } from '../db/db.connection';
import { Company } from '../entity/company.entity';
import { MessageEntity } from '../entity/message.entity';

interface MensajeDTO {
  id: string;
  text: string;
  platform: string;
  timestamp: Date;
}

export class GetMessageByBussiness {
  private empresaRepo: Repository<Company>;
  private messageRepo: Repository<MessageEntity>;

  constructor() {
    this.empresaRepo = AppDataSource.getRepository(Company);
    this.messageRepo = AppDataSource.getRepository(MessageEntity);
  }

  async getMessagesByBussiness(empresaId: string): Promise<MensajeDTO[]> {
    const empresa = await this.empresaRepo.findOneBy({ businessId: empresaId });
    if (!empresa) throw new Error('Empresa no encontrada');

    const ids = [
      empresa.facebookPageId,
      empresa.instagramBusinessId,
      empresa.whatsappBusinessId,
    ].filter(Boolean); // Evita valores nulos/undefined

    if (ids.length === 0) return [];

    const mensajes = await this.messageRepo
      .createQueryBuilder('msg')
      .where('msg.senderId IN (:...ids)', { ids })
      .orWhere('msg.recipientId IN (:...ids)', { ids })
      .orderBy('msg.timestamp', 'DESC')
      .getRawMany();

    return mensajes.map((msg): MensajeDTO => ({
      id: msg.msg_id,
      text: msg.msg_text,
      platform: msg.msg_platform,
      timestamp: msg.msg_timestamp,
    }));
  }
}
