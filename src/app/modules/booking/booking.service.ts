import { JwtPayload } from 'jsonwebtoken';
import { TBooking } from './booking.interface';
import moment from 'moment';
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

const checkAvailabilityInToDB = async (dateFromQuery: string) => {
    const dateParam = dateFromQuery || moment().format('YYYY-MM-DD');
    const date = dateParam;
  
    const bookings = await BookingModel.find({ date: date }).select(
        'startTime endTime -_id',
      );
    //   console.log(bookings)

      const startDay = moment('00:00', 'HH:mm')
      const endDay = moment('00:00', 'HH:mm')
    //   console.log(startDay)
    //   console.log(endDay)

      const bookingsSorted = bookings.sort((a, b) =>
        moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm')),
      );
    //   console.log(bookingsSorted)

      const availableSlots = [];
      //show the booking availability
      if (bookingsSorted.length === 0) {
        availableSlots.push({
          startTime: '00:00',
          endTime: '23:59',
        });
        return availableSlots;
      }
     //checking time bwfore first booking
      if (startDay.isBefore(moment(bookingsSorted[0].startTime, 'HH:mm'))) {
        availableSlots.push({
          startTime: startDay.format('HH:mm'),
          endTime: moment(bookingsSorted[0].startTime, 'HH:mm').format('HH:mm'),
        });
      }


       // Check gaps between bookings
  for (let i = 0; i < bookingsSorted.length - 1; i++) {
    const currentBookingEnd = moment(bookingsSorted[i].endTime, 'HH:mm');
    const nextBookingStart = moment(bookingsSorted[i + 1].startTime, 'HH:mm');

    if (currentBookingEnd.isBefore(nextBookingStart )) {
      availableSlots.push({
        startTime: currentBookingEnd.format('HH:mm'),
        endTime: nextBookingStart .format('HH:mm'),
      });
    }
  }

   // Check time after the last booking
   if (
    moment( bookingsSorted[ bookingsSorted.length - 1].endTime, 'HH:mm').isBefore(
        endDay,
    )
  ) {
    availableSlots.push({
      startTime: moment(
        bookingsSorted[ bookingsSorted.length - 1].endTime,
        'HH:mm',
       ).format('HH:mm'),
      endTime: '23:59',
    });
  }

  return availableSlots;
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
  checkAvailabilityInToDB,
};
