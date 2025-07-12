import { Router } from 'express';
import { getMessages } from '../../controllers/getMessages.controller';

const router = Router();

router.get('/bussiness/messages', getMessages as any);


export default router;
