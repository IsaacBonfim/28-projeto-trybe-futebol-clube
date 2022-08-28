import { Request, Response } from 'express';
import Helper from '../helper/Leaderboard.Helper';

class LeaderboardController {
  static async homeBoard(req: Request, res: Response) {
    const { type } = req.params;
    const homeBoard = await Helper.board(type);
    const orderedBoard = await Helper.SortBoard(homeBoard);

    res.status(200).send(orderedBoard);
  }
}

export default LeaderboardController;
