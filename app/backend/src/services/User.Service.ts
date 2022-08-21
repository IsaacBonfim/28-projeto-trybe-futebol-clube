import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';
import User from '../database/models/User.Model';
import Login from '../interfaces/Interfaces';
import CodeError from '../errors/CodeError';

class UserService {
  static loginValidation(login: Login) {
    const validation = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { value, error } = validation.validate(login);

    if (error) {
      throw new CodeError('All fields must be filled', 400);
    }

    return value;
  }

  static async login(email: string) {
    const result = await User.findOne(
      { where: { email }, raw: true },
    );

    if (!result) {
      throw new CodeError('Incorrect email or password', 401);
    }

    return result;
  }

  static async getToken(user: User | null) {
    const secret: string = process.env.JWT_SECRET || 'jwt_secret';
    const token = jwt.sign({ data: user }, secret);

    return token;
  }
}

export default UserService;
