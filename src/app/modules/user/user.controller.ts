import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status'

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.createUserFromDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User registered successfully',
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createUser,
};