import dotenv from 'dotenv';
dotenv.config();
const { META_APP_ID, META_REDIRECT_URI } = process.env;

interface MetaState {
  companyId: string;
  name: string;
  type: string;
}

interface CreateMetaChannelParams {
  companyId: string;
  type: 'whatsapp' | 'instagram' | 'facebook'; // mejora el typing
  name: string;
}

export class ChannelsService {
  constructor(private readonly channelRepository?: any) {} // tipalo si podés
  async createMetaChannel({
    companyId,
    type,
    name,
  }: CreateMetaChannelParams): Promise<string> {
    const state: MetaState = { companyId, name, type };

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(META_REDIRECT_URI as string)}&scope=pages_show_list,pages_read_engagement,business_management&auth_type=rerequest`;
    return url;
  }
}
