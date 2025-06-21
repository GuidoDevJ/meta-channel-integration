import { DataSource, Repository } from 'typeorm';
import { Company } from '../entity/company.entity';

export class CompanyRepository {
  private repository: Repository<Company>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Company);
  }

  async create(data: {
    name: string;
    businessId: string;
    facebookPageId?: string;
    instagramBusinessId?: string;
    companyAccessToken: string;
    accessToken: string;
    whatsappBusinessId: string;
    type: 'facebook' | 'instagram' | 'whatsapp';
  }): Promise<Company> {
    const company = this.repository.create(data);
    return await this.repository.save(company);
  }

  async createOrUpdateByBusinessId(data: {
    name: string;
    businessId: string;
    facebookPageId?: string;
    instagramBusinessId?: string;
    accessToken: string;
    tokenExpiresAt: Date;
    type: 'facebook' | 'instagram' | 'whatsapp';
  }): Promise<Company> {
    const existing = await this.repository.findOneBy({
      businessId: data.businessId,
    });

    if (existing) {
      this.repository.merge(existing, data);
      return await this.repository.save(existing);
    }

    const company = this.repository.create(data);
    return await this.repository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return await this.repository.find({ relations: ['costs'] });
  }

  async findByBusinessId(businessId: string): Promise<Company | null> {
    return await this.repository.findOneBy({ businessId });
  }

  async updateName(id: string, name: string): Promise<Company> {
    const company = await this.repository.findOneBy({ id });
    if (!company) throw new Error('Company not found');
    company.name = name;
    return await this.repository.save(company);
  }

  async delete(id: string): Promise<any> {
    return await this.repository.delete({
      businessId: id,
    });
  }
}
