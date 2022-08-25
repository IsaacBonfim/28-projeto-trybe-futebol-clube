import { Router } from 'express';
import Controller from '../controllers/Match.Controller';

const route = Router();

route
  .get('/', Controller.getMatches)
  .post('/', Controller.postMatches);

export default route;
