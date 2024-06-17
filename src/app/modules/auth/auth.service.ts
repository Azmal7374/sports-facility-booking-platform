import { TLoginUser } from './auth.interface';
import { UserModel } from '../user/user.model';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { createToken } from './auth.utils';
import config from '../../config';

const login = async (payload: TLoginUser) => {
  const user = await UserModel.findOne({ email: payload.email })

  if(!user) {
    throw new Error('User not found!!');
  }

  const matchPassword = await bcrypt.compare(
    payload.password,
    user.password as string,
  );

  if(!matchPassword) {
    throw new Error('Password is not match');
  }

  
  const jwtPayload: JwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_acess_token_secret as string,
    config.access_token_expires_in as string,
  );

  const userData = await  UserModel.findOne({email:payload.email});

  return {
    accessToken,
    userData
  }
 
};

export const AuthServices = {
  login,
};