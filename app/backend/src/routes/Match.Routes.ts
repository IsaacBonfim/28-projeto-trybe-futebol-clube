import { Router } from 'express';
import Controller from '../controllers/Match.Controller';

const route = Router();

route.get('/', Controller.getMatches);

export default route;
