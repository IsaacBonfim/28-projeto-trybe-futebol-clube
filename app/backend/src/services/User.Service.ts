import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';
import * as bcrypt from 'bcryptjs';
import Model from '../database/models/User.Model';
import { Login, Token } from '../interfaces/Interfaces';
import CodeError from '../errors/CodeError';

class UserService {
  private static secret = process.env.JWT_SECRET || 'jwt_secret';

  static loginValidation(login: Login) {
    const validation = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { value, error } = validation.validate(login);

    if (error) {
      throw new CodeError('All fields must be filled', 400);
    }

    return value;
  }

  static async login(email: string) {
    const result = await Model.findOne(
      { where: { email }, raw: true },
    );

    if (!result) {
      throw new CodeError('Incorrect email or password', 401);
    }

    return result;
  }

  static async passwordValidation(password: string, userPassword: string) {
    const result = await bcrypt.compare(password, userPassword);
    console.log(result, password);
    if (!result) {
      throw new CodeError('Incorrect email or password', 401);
    }
  }

  static async getToken(user: Login | null) {
    const token = jwt.sign({ data: user }, this.secret);

    return token;
  }

  static async tokenVerification(token: string) {
    const data = jwt.verify(token, this.secret);

    return data as Token;
  }
}

export default UserService;
