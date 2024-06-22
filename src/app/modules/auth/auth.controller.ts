import { RequestHandler } from 'express';
import { AuthServices } from './auth.service';
import httpStatus from 'http-status';

const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.login(req.body);
    const { accessToken, userData } = result;

    return res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      token: accessToken,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthControllers = {
  login,
};
