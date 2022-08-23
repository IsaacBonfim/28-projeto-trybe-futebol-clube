import { Router } from 'express';
import Controller from '../controllers/Team.Controller';

const route = Router();

route.get('/', Controller.getTeams);

export default route;
