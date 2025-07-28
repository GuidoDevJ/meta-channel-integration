import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Company } from '../entity/company.entity';
import { Cost } from '../entity/cost.entity';
import { MessageEntity } from '../entity/message.entity';

const { SQL_HOST, DB_PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = process.env;

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: SQL_HOST,
  port: +DB_PORT!,
  username: SQL_USER,
  password: SQL_PASSWORD,
  database: SQL_DATABASE,
  synchronize: false,
  logging: false,
  entities: [Company, Cost, MessageEntity],
});
