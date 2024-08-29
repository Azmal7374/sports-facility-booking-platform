import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';
import httpStatus from 'http-status';

const createBooking: RequestHandler = async (req, res, next) => {
  try {
    const result = await BookingServices.createBookingFromDB(
      req.body,
      req.user,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
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

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        result.length === 0
          ? 'No Data Found'
          : 'Bookings retrieved succesfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const viewAllBookingsByUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await BookingServices.viewAllBookingsByUserFromDB(req.user);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        result.length === 0
          ? 'No Data Found'
          : 'Bookings retrieved succesfully',
      data: result,
    });
  } catch (err) {
   
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
    next()
  }
};

const cancelBooking: RequestHandler = async (req, res, next) => {
  try {
    const result = await BookingServices.cancelBookingInToDB(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Booking cancelled succesfully!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const checkAvailability: RequestHandler = async (req, res, next) => {
  try {
    const result = await BookingServices.checkAvailabilityInToDB(
      req.query.date as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Availability checked successfully!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const paymentConfirmation: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { transactionId } = req.query;

    const result = await BookingServices.conformPayment(
      transactionId as string,
    );

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const BookingControllers = {
  createBooking,
  viewAllBookings,
  viewAllBookingsByUser,
  cancelBooking,
  checkAvailability,
  paymentConfirmation,
};
