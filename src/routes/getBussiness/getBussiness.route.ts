import { Router } from 'express';
import { getCompanyByBusinessId } from '../../controllers/getCompany.controller';

const router = Router();
router.get('/company/:businessId', getCompanyByBusinessId as any);
export default router;
