import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

const createBooking: RequestHandler = async (req, res, next) => {
  try {
    const result = await BookingServices.createBookingFromDB(req.body, req.user);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Booking Created Successfully!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};




const viewAllBookings: RequestHandler = async (req, res, next) => {
    try {
        const result = await BookingServices.viewAllBookingsFromDB();

        if(result.length === 0) {
            sendResponse(res, {
                success: false,
                statusCode: 404,
                message: 'No Data Found',
                data: [],
            })
        }
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Bookings retrieved succesfully',
            data: result,
        })
       
      } catch (error) {
        next(error);
      }
  };
  
  const viewAllBookingsByUser: RequestHandler = async (req, res, next) => {
    try {
        const result = await BookingServices.viewAllBookingsByUserFromDB(req.user);
    
        if(result.length === 0) {
            sendResponse(res, {
                success: false,
                statusCode: 404,
                message: 'No Data Found',
                data: [],
            })
        }
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Bookings retrieved succesfully',
            data: result,
        })
       
      } catch (error) {
        next(error);
      }
  };
  
const cancelBooking: RequestHandler = async (req, res, next) => {
    try {
        const result = await BookingServices.cancelBookingInToDB(req.params.id);
    
        sendResponse(res ,{
            success: true,
            statusCode: 200,
            message: 'Booking cancelled succesfully!!',
            data: result,
        })
      } catch (error) {
        next(error);
      }
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