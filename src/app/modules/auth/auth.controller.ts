import { RequestHandler } from "express";
import { AuthServices } from "./auth.service";


const login: RequestHandler = async (req, res, next) => {
    try {
      const result = await AuthServices.login(req.body);
      
    
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'User logged in successfully',
        data:  result,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const AuthControllers = {
    login,
  };