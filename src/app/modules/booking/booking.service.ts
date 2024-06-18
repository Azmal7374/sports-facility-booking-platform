import { JwtPayload } from 'jsonwebtoken';
import { TBooking } from './booking.interface';
import { UserModel } from '../user/user.model';
import { FacilityModel } from '../facility/facility.model';
import { BookingModel } from './booking.model';

const createBookingFromDB = async (payload: TBooking, user: JwtPayload) => {
//   const userData = await UserModel.findOne({ email: user.email });
//   const facilityDetails = await FacilityModel.findById(payload.facility);

//   if (!facilityDetails) {
//     throw new Error('Facility not found!');
//   }

  const result = await BookingModel.create(payload);
  return result;
};

const viewAllBookings = async () => {
  
};

const viewAllBookingsByUser = async () => {
 
};

const checkAvailability = async () => {
  
};

const cancelBooking = async () => {
  };

export const BookingServices = {
  createBookingFromDB,
  viewAllBookings,
  viewAllBookingsByUser,
  cancelBooking,
  checkAvailability,
};
