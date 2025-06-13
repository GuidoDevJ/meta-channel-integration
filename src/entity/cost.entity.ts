import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity({ name: 'costs' })
export class Cost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column({ name: 'amount_usd', type: 'numeric', precision: 10, scale: 2 })
  amountUsd: number;

  @ManyToOne(() => Company, (company) => company.costs, { onDelete: 'CASCADE' })
  company: Company;
}
