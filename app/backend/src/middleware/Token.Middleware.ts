import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { Login, Token } from '../interfaces/Interfaces';

class TokenMiddleware {
  private static secret = process.env.JWT_SECRET || 'jwt_secret';

  static async getToken(user: Login | null) {
    const token = jwt.sign({ data: user }, this.secret);

    return token;
  }

  static async tokenVerification(token: string) {
    const data = jwt.verify(token, this.secret);

    return data as Token;
  }
}

export default TokenMiddleware;
