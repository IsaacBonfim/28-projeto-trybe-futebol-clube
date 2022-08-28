import { Request, Response } from 'express';
import Helper from '../helper/Leaderboard.Helper';

class LeaderboardController {
  static async Leaderboard(req: Request, res: Response) {
    const { type } = req.params;
    const board = await Helper.board(type);
    const orderedBoard = await Helper.SortBoard(board);

    res.status(200).send(orderedBoard);
  }
}

export default LeaderboardController;
