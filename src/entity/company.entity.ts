import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cost } from './cost.entity';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'business_id' })
  businessId: string;

  @Column({ name: 'facebook_page_id', nullable: true })
  facebookPageId: string;

  @Column({ name: 'instagram_business_id', nullable: true })
  instagramBusinessId: string;

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string;
  @Column({ name: 'company_access_token', type: 'text' })
  companyAccessToken: string;

  @Column({
    name: 'token_expires_at',
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  tokenExpiresAt: Date;

  @Column({ type: 'enum', enum: ['facebook', 'instagram', 'whatsapp'] })
  type: 'facebook' | 'instagram' | 'whatsapp';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Cost, (cost) => cost.company)
  costs: Cost[];
}
