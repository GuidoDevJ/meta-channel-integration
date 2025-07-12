import { DataSource } from 'typeorm';
import { Company } from '../entity/company.entity';
import { CompanyRepository } from '../repository/company.repository';

export class GetCompanyService {
  private companyRepository: CompanyRepository;

  constructor(private dataSource: DataSource) {
    this.companyRepository = new CompanyRepository(dataSource);
  }

  async getCompanyByBusinessId(businessId: string): Promise<Company> {
    const company = await this.companyRepository.findByBusinessId(businessId);

    if (!company) {
      throw new Error('Company not found');
    }

    return company;
  }
}
