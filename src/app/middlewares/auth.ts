import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const auth = (...roles: string[]) => {
  const authorize: RequestHandler = async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      // checking if the token is missing
      if (!token) {
        throw new Error('You must login first!');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  return authorize;
};

export default auth;