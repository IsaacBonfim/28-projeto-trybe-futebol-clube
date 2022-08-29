import { Request, Response } from 'express';
import Helper from '../helper/Leaderboard.Helper';

class LeaderboardController {
  static async Leaderboard(req: Request, res: Response) {
    const { type } = req.params;
    const board = await Helper.board(type);
    const orderedBoard = await Helper.sortBoard(board);

    res.status(200).send(orderedBoard);
  }

  static async fullLeaderboard(_req: Request, res: Response) {
    const fullBoard = await Helper.fullBoard();
    const orderedBoard = await Helper.sortBoard(fullBoard);

    res.status(200).json(orderedBoard);
  }
}

export default LeaderboardController;
