import { Router } from 'express';
import Controller from '../controllers/Match.Controller';

const route = Router();

route
  .get('/', Controller.getMatches)
  .post('/', Controller.postMatches)
  .patch('/:id/finish', Controller.finishMatch)
  .patch('/:id', Controller.updateMatch);

export default route;
