import { DataSource, Repository } from 'typeorm';
import { InstagramProfile } from '../entity/instagram.entity';

export class InstagramProfileRepository  {
  private repository: Repository<InstagramProfile>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(InstagramProfile);
  }

  async create(profile:any): Promise<InstagramProfile> {
    return this.repository.save(profile);
  }

  async findById(id: string): Promise<InstagramProfile | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<InstagramProfile | null> {
    return this.repository.findOneBy({ username });
  }

  async update(profile: InstagramProfile): Promise<InstagramProfile> {
    return this.repository.save(profile);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
