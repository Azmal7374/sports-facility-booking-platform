import { JwtPayload } from 'jsonwebtoken';
import { TBooking } from './booking.interface';
import { UserModel } from '../user/user.model';
import { FacilityModel } from '../facility/facility.model';
import { BookingModel } from './booking.model';

const createBookingFromDB = async (payload: TBooking, user: JwtPayload) => {
 
  const result = await BookingModel.create(payload);
  return result;
};

const viewAllBookingsFromDB = async () => {
    const result = await BookingModel.find()
    .populate('user')
    .populate('facility');
  return result;
};

const viewAllBookingsByUserFromDB = async (user: JwtPayload) => {
    const result = await BookingModel.find()
    .populate({
      path: 'user',
      match: { email: user.email },
    })
    .populate('facility');

  //user does not match the bookings
  const filteredResult = result.filter((booking) => booking.user);

  return filteredResult;
};

const checkAvailability = async () => {
  
};

const cancelBookingInToDB = async (id: string) => {
    const result = await BookingModel.findOneAndUpdate(
        { _id: id },
        { isBooked: 'cancelled' },
        { new: true, runValidators: true },
      ).populate('facility');
    
      if (!result) {
        throw new Error('Booking not found!!');
      }
    
      return result;
  };

export const BookingServices = {
  createBookingFromDB,
  viewAllBookingsFromDB,
  viewAllBookingsByUserFromDB,
  cancelBookingInToDB ,
  checkAvailability,
};
