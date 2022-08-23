import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';
import Model from '../database/models/User.Model';
import { Login, Token } from '../interfaces/Interfaces';
import CodeError from '../errors/CodeError';

class UserService {
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

  static async getToken(user: Login | null) {
    // const secret: string = process.env.JWT_SECRET || 'jwt_secret';
    const secret = 'jwt_secret';
    const token = jwt.sign({ data: user }, secret);

    return token;
  }

  static async tokenVerification(token: string) {
    // const secret: string = process.env.JWT_SECRET || 'jwt_secret';
    const secret = 'jwt_secret';
    const data = jwt.verify(token, secret);

    return data as Token;
  }
}

export default UserService;
