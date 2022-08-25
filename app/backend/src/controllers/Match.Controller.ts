import { Request, Response } from 'express';
import Service from '../services/Match.Service';

class MatchController {
  static async getMatches(_req: Request, res: Response) {
    const matches = await Service.getMatches();

    res.status(200).json(matches);
  }

  static async postMatches(req: Request, res: Response) {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = req.body;

    await Service.idTeamValidation(homeTeam);
    await Service.idTeamValidation(awayTeam);

    const newMatch = await Service.postMatches(
      { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals },
    );

    res.status(201).json(newMatch);
  }
}

export default MatchController;
