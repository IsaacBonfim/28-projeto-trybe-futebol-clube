import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { Login, Token } from '../interfaces/Interfaces';
import CodeError from '../errors/CodeError';

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

  static async tokenValidation(token: string) {
    const message = 'Token must be a valid token';

    if (!token) throw new CodeError(message, 401);

    const realToken = jwt.decode(token, { complete: true });

    if (!realToken) throw new CodeError(message, 401);
  }
}

export default TokenMiddleware;
