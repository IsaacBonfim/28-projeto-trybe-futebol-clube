import { Request, Response } from 'express';
import Service from '../services/Team.Service';

class TeamController {
  static async getTeams(_req: Request, res: Response) {
    const teams = await Service.getTeams();

    res.status(200).json(teams);
  }

  static async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await Service.getTeamById(id);

    res.status(200).json(team);
  }
}

export default TeamController;
