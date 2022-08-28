import { Router } from 'express';
import Controller from '../controllers/Leaderboard.Controller';

const route = Router();

route
  .get('/:type', Controller.homeBoard);

export default route;
