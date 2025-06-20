import * as dotenv from 'dotenv';
dotenv.config();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN_WEBHOOK;

export { VERIFY_TOKEN };
