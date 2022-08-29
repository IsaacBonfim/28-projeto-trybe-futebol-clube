import { Router } from 'express';
import Controller from '../controllers/Leaderboard.Controller';

const route = Router();

route
  .get('/', Controller.fullLeaderboard)
  .get('/:type', Controller.Leaderboard);

export default route;
