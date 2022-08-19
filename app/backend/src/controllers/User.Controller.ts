import { Request, Response } from 'express';
import Servise from '../services/User.Service';

class UserController {
  static async login(req: Request, res: Response) {
    const { email } = req.body;
    const user = await Servise.login(email);
    const token = await Servise.getToken(user);

    res.status(200).json({ token });
  }
}

export default UserController;
