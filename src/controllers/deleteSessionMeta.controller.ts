import { NextFunction, Request, Response } from 'express';
import { CompanyService } from '../services/company.service';

const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { companyId } = req.params;
  try {
    const companyService = await CompanyService.init();

    const result = await companyService.deleteCompanySession(companyId);
    if (result.status === 404) return res.status(404).json(result);
    res.status(200).json({
      msg: 'Compañia eliminada correctamente',
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
export { deleteCompany };
