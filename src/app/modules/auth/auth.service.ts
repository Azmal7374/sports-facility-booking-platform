import { TLoginUser } from './auth.interface';
import { UserModel } from '../user/user.model';

const login = async (payload: TLoginUser) => {
  const user = await UserModel.findOne({ email: payload.email })

 
};

export const AuthServices = {
  login,
};