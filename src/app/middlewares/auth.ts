import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { UserModel } from '../modules/user/user.model';
import config from '../config';

const auth = (...roles: string[]) => {
  const authorize: RequestHandler = async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      // check token is missing
      if (!token) {
        throw new Error('You must login first!');
      }
      const tokenSplit = token.split(' ');

      // checking  token is in the right format
      if (tokenSplit.length !== 2 || tokenSplit[0] !== 'Bearer') {
        throw new Error('Please Provide Valid Token Format');
      }

      // Extract the token from the token parts
      const accessToken = tokenSplit[1];

      // checking if the given token is valid
      const decoded = jwt.verify(
        accessToken,
        config.jwt_acess_token_secret as string,
      ) as JwtPayload;

      const { email, role } = decoded;

      // checking if the user is exist
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        throw new Error('This user is not found !');
      }

      if (roles && !roles.includes(role)) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'You have no access to this route',
        });
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };

  return authorize;
};

export default auth;