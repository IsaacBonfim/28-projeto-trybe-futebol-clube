import { Router } from 'express';
import Controller from '../controllers/User.Controller';

const route = Router();

route.post('/', Controller.login);

export default route;
