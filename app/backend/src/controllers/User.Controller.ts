import { Request, Response } from 'express';
import Service from '../services/User.Service';

class UserController {
  static async login(req: Request, res: Response) {
    const { email, password } = await Service.loginValidation(req.body);
    const user = await Service.login(email);

    await Service.passwordValidation(password, user.password);

    const token = await Service.getToken(user);

    res.status(200).json({ token });
  }

  static async loginVerification(req: Request, res: Response) {
    const token = req.headers.authorization || 'tokenfake';
    const { data: { email } } = await Service.tokenVerification(token);
    const { role } = await Service.login(email);

    res.status(200).json({ role });
  }
}

export default UserController;
