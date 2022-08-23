import { Request, Response } from 'express';
import Service from '../services/Match.Service';

class MatchController {
  static async getMatches(_req: Request, res: Response) {
    const matches = await Service.getMatches();

    res.status(200).json(matches);
  }
}

export default MatchController;
