import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  platform: 'instagram' | 'page' | 'whatsapp_business_account';

  @Column({ type: 'varchar', length: 100 })
  senderId: string;

  @Column({ type: 'varchar', length: 100 })
  recipientId: string;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
  @Column({ type: 'varchar', length: 255, nullable: true })
  messageId: string;

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column({ type: 'boolean', default: false })
  isEcho: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  appId?: string;

  @Column({ type: 'json', nullable: true })
  raw?: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
