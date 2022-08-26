import { Request, Response } from 'express';
import Service from '../services/Match.Service';
import tkMiddleware from '../middleware/Token.Middleware';
import CodeError from '../errors/CodeError';

class MatchController {
  static async getMatches(_req: Request, res: Response) {
    const matches = await Service.getMatches();

    res.status(200).json(matches);
  }

  static async postMatches(req: Request, res: Response) {
    const token = req.headers.authorization || 'tokenfake';

    const data = await tkMiddleware.tokenVerification(token);

    if (!data) throw new CodeError('Invalid token', 401);

    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = req.body;

    await Service.idTeamValidation(homeTeam);
    await Service.idTeamValidation(awayTeam);

    const newMatch = await Service.postMatches(
      { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals },
    );

    res.status(201).json(newMatch);
  }

  static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    await Service.finishMatch(id);

    res.status(200).json({ message: 'Finished' });
  }
}

export default MatchController;
