import { Request, Response } from 'express';
import Service from '../services/Team.Service';

class TeamController {
  static async getTeams(_req: Request, res: Response) {
    const teams = await Service.getTeams();

    res.status(200).json(teams);
  }
}

export default TeamController;
