import { Request, Response } from 'express';
import { GetMessageByBussiness } from '../services/getMessage.service';

const bussinessService = new GetMessageByBussiness();

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { bussinessId } = req.query;

    if (!bussinessId || typeof bussinessId !== 'string') {
      return res.status(400).json({ error: 'empresaId es requerido y debe ser un string' });
    }

    const mensajes = await bussinessService.getMessagesByBussiness(bussinessId);
    res.json({ count: mensajes.length, data: mensajes });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error interno del servidor' });
  }
};
