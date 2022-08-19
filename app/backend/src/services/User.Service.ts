import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import User from '../database/models/User.Model';

class UserService {
  static async login(email: string) {
    const result = await User.findOne(
      { where: { email }, raw: true },
    );
    return result;
  }

  static async getToken(user: User | null) {
    const secret: string = process.env.JWT_SECRET || 'jwt_secret';
    const token = jwt.sign({ data: user }, secret);

    return token;
  }
}

export default UserService;
