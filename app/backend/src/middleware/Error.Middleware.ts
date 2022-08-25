import { Request, Response, NextFunction } from 'express';
import CodeError from '../errors/CodeError';

const ErroMiddleware = (err: CodeError, _req: Request, res: Response, _next: NextFunction) => {
  const { message, code } = err;

  res.status(code || 500).json({ message });
};

export default ErroMiddleware;
