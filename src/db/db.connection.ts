import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Company } from '../entity/company.entity';
import { Cost } from '../entity/cost.entity';
import { InstagramProfile } from '../entity/instagram.entity';
import { MessageEntity } from '../entity/message.entity';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: DB_HOST,
  port: +DB_PORT!,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Company, Cost, MessageEntity,InstagramProfile],
});
