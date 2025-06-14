import axios from 'axios';
import dotenv from 'dotenv';
import { AppDataSource } from '../db/db.connection';
import { CompanyRepository } from '../repository/company.repository';
dotenv.config();
const APP_ID = process.env.META_APP_ID!;
const APP_SECRET = process.env.META_APP_SECRET!;
const REDIRECT_URI = process.env.META_REDIRECT_URI!;

export class MetaOauthService {
  private companyRepository: CompanyRepository;

  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error(
        'DataSource not initialized. Run MetaOauthService.init() first.'
      );
    }
    this.companyRepository = new CompanyRepository(AppDataSource);
  }

  static async init(): Promise<MetaOauthService> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return new MetaOauthService();
  }
  private async exchangeCodeForShortToken(code: string) {
    try {
      const response = await axios.get(
        'https://graph.facebook.com/v19.0/oauth/access_token',
        {
          params: {
            client_id: APP_ID,
            client_secret: APP_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error al obtener el token corto:', error);
      throw new Error('Error al obtener el token corto');
    }
  }

  private async exchangeShortTokenForLongToken(shortToken: string) {
    const response = await axios.get(
      'https://graph.facebook.com/v19.0/oauth/access_token',
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: APP_ID,
          client_secret: APP_SECRET,
          fb_exchange_token: shortToken,
        },
      }
    );
    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
    };
  }

  private async getBusinessIdAndCompanyData(
    accessToken: string,
    type: 'whatsapp' | 'instagram' | 'facebook'
  ) {
    if (type === 'whatsapp') {
      const me = await axios.get('https://graph.facebook.com/v19.0/me', {
        params: { fields: 'id', access_token: accessToken },
      });
      const wabaId = me.data.id;

      const phones = await axios.get(
        `https://graph.facebook.com/v19.0/${wabaId}/phone_numbers`,
        { params: { access_token: accessToken } }
      );

      return {
        businessId: phones.data.data[0].id,
        companyName: '',
        companyAccessToken: '',
      };
    } else if (type === 'instagram') {
      const pages = await axios.get(
        'https://graph.facebook.com/v19.0/me/accounts',
        {
          params: {
            fields: 'instagram_business_account',
            access_token: accessToken,
          },
        }
      );
      return {
        businessId: pages.data.data[0].instagram_business_account.id,
        companyName: '',
        companyAccessToken: '',
      };
    } else {
      const pages = await axios.get(
        'https://graph.facebook.com/v19.0/me/accounts',
        {
          params: { access_token: accessToken },
        }
      );
      return {
        businessId: pages.data.data[0].id,
        companyName: pages.data.data[0].name,
        companyAccessToken: pages.data.data[0].access_token,
      };
    }
  }

  private async getInstagramBusinessAccount(
    businessId: string,
    companyAccessToken: string
  ) {
    const igAccountRes = await axios.get(
      `https://graph.facebook.com/v19.0/${businessId}`,
      {
        params: {
          fields: 'instagram_business_account',
          access_token: companyAccessToken,
        },
      }
    );
    return igAccountRes.data.instagram_business_account?.id;
  }

  async handleCallback(
    code: string,
    type: 'whatsapp' | 'instagram' | 'facebook' = 'facebook'
  ) {
    // Paso 1: Token corto
    const shortToken = await this.exchangeCodeForShortToken(code);

    // Paso 2: Token largo
    const { accessToken, expiresIn } =
      await this.exchangeShortTokenForLongToken(shortToken);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Paso 3: Obtener businessId, companyName y companyAccessToken según el tipo
    const { businessId, companyName, companyAccessToken } =
      await this.getBusinessIdAndCompanyData(accessToken, type);

    // Paso 4: Obtener instagram_business_account si existe
    const igAccountId = await this.getInstagramBusinessAccount(
      businessId,
      companyAccessToken
    );

    console.log({
      companyName,
      type,
      businessId,
      accessToken,
      expiresAt,
      igAccountId,
      companyAccessToken,
    });
    await this.companyRepository.create({
      name: companyName,
      type,
      businessId,
      accessToken,
      instagramBusinessId: igAccountId,
      companyAccessToken,
    });
    return {
      companyName,
      type,
      businessId,
      accessToken,
      expiresAt,
    };
  }
}
