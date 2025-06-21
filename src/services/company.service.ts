import dotenv from 'dotenv';
import { AppDataSource } from '../db/db.connection';
import { CompanyRepository } from '../repository/company.repository';
dotenv.config();
const APP_ID = process.env.META_APP_ID!;
const APP_SECRET = process.env.META_APP_SECRET!;
const REDIRECT_URI = process.env.META_REDIRECT_URI!;

export class CompanyService {
  private companyRepository: CompanyRepository;

  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error(
        'DataSource not initialized. Run MetaOauthService.init() first.'
      );
    }
    this.companyRepository = new CompanyRepository(AppDataSource);
  }

  static async init(): Promise<CompanyService> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return new CompanyService();
  }

  async deleteCompanySession(companyId: string) {
    try {
      const data = await this.companyRepository.delete(companyId);
      if (!data) {
        return {
          msg: 'Company not found',
          status: 404,
        };
      }
      return data;
    } catch (error) {
      console.error('Error deleting company session:', error);

      return {
        msg: 'Internal server error',
        status: 500,
      };
    }
  }
}
