import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { validateUser } from '../user/user.validation';
import { UserControllers } from '../user/user.controller';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';



const router = express.Router();

router.post(
  '/signup',
  validateRequest(validateUser.createUserValidation),
  UserControllers.createUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

export const AuthRoutes = router;