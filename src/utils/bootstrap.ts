import { AppDataSource } from '../db/db.connection';

export async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Data Source initialized');
}
