// src/controllers/company.controller.ts

import { Request, Response } from 'express';
import { GetCompanyService } from '../services/getBussiness.service';
import { AppDataSource } from '../db/db.connection';

const companyService = new GetCompanyService(AppDataSource);

export const getCompanyByBusinessId = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({ error: 'Missing businessId in params' });
    }

    const company = await companyService.getCompanyByBusinessId(businessId);
    return res.status(200).json(company);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
