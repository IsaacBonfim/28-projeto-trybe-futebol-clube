import { Request, Response } from 'express';
import Servise from '../services/User.Service';

class UserController {
  static async login(req: Request, res: Response) {
    const { email } = await Servise.loginValidation(req.body);
    const user = await Servise.login(email);
    const token = await Servise.getToken(user);

    res.status(200).json({ token });
  }

  static async loginVerification(req: Request, res: Response) {
    const token = req.headers.authorization || 'tokenfake';
    const { data: { email } } = await Servise.tokenVerification(token);
    const { role } = await Servise.login(email);

    res.status(200).json({ role });
  }
}

export default UserController;
