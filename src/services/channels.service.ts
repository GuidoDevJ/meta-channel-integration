import dotenv from 'dotenv';
dotenv.config();
const { META_APP_ID, META_REDIRECT_URI } = process.env;

interface MetaState {
  companyId: string;
  name: string;
  type: string;
}

export class ChannelsService {
  constructor() {} // tipalo si podés
  async createMetaChannel(companyId: string): Promise<string> {
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(META_REDIRECT_URI as string)}&scope=pages_show_list,pages_read_engagement,business_management&auth_type=rerequest&prompt=consent&state=${companyId}`;
    return url;
  }
}
