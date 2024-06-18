import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

const createBooking: RequestHandler = async (req, res, next) => {
  try {
    const result = await BookingServices.createBookingFromDB(req.body, req.user);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Facilities retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};




const viewAllBookings: RequestHandler = async (req, res, next) => {
   
  };
  
  const viewAllBookingsByUser: RequestHandler = async (req, res, next) => {
   
  };
  
const cancelBooking: RequestHandler = async (req, res, next) => {
    
  };
  
const checkAvailability: RequestHandler = async (req, res, next) => {
    
  };







export const BookingControllers = {
    createBooking,
    viewAllBookings,
    viewAllBookingsByUser,
    cancelBooking,
    checkAvailability,
  };