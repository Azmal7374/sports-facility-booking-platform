import { JwtPayload } from 'jsonwebtoken';
import { TBooking } from './booking.interface';
import moment from 'moment';
import { BookingModel } from './booking.model';
import { UserModel } from '../user/user.model';
import { Types } from 'mongoose';
import payableAmountCalculate from '../../utils/calculatePayable';
import { initiatePayment, verifyPayment } from '../../utils/PaymentGateway';
import FacilityModel from '../facility/facility.model';

const createBookingFromDB = async (payload: TBooking, user: JwtPayload) => {
  const userData = await UserModel.findOne({ email: user.email });
  const facilityDetails = await FacilityModel.findById(payload.facility);

  if (!facilityDetails) {
    throw new Error('Facility not found!');
  }

  const bookings = await BookingModel.find({
    date: payload.date,
  });

  // Check for duplicated bookings
  const startRequesteTime = moment(payload.startTime, 'HH:mm');
  const endReuesteTime = moment(payload.endTime, 'HH:mm');

  for (const booking of bookings) {
    const startTimeInBookings = moment(booking.startTime, 'HH:mm');
    const endTimeInBookings = moment(booking.endTime, 'HH:mm');

    const timeMatching =
      startRequesteTime.isBefore(endTimeInBookings) &&
      endReuesteTime.isAfter(startTimeInBookings);
    //check request time slot already matched
    if (timeMatching) {
      throw new Error('The requested time slot is already booked!');
    }
  }

  const transactionId = `TXN-${Date.now()}`;

  payload.user = userData?._id as Types.ObjectId;
  payload.transactionId = transactionId;
  payload.payableAmount = payableAmountCalculate(
    payload.endTime,
    payload.startTime,
    facilityDetails?.pricePerHour as number,
  );

  const paymentInfo = {
    transactionId,
    totalPrice: parseFloat(payload.payableAmount.toFixed(2)),
    custormerName: userData?.name,
    customerEmail: userData?.email,
    customerAddress: userData?.address,
    customerPhone: userData?.phone,
  };

  const booking = await BookingModel.create({
    ...payload,
    payableAmount: parseFloat(payload.payableAmount.toFixed(2)),
  });

  const initializePayment = await initiatePayment(paymentInfo);

  return { booking, initializePayment };
};

const viewAllBookingsFromDB = async () => {
  const result = await BookingModel.find({ isBooked: 'confirmed' })
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

  const filteredResult = result.filter((booking) => booking.user);

  return filteredResult;
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
const checkAvailabilityInToDB = async (dateFromQuery: string) => {
  //set the  date
  const dates = dateFromQuery || moment().format('YYYY-MM-DD');
  const date = dates;

  const bookings = await BookingModel.find({ date: date }).select(
    'startTime endTime -_id',
  );
  //   console.log(bookings)

  const startDay = moment('00:00', 'HH:mm');
  const endDay = moment('00:00', 'HH:mm');
  //   console.log(startDay)
  //   console.log(endDay)
  //booking arranged
  const bookingsSorted = bookings.sort((a, b) =>
    moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm')),
  );
  //   console.log(bookingsSorted)

  const availableSlots = [];
  //full day available with no bookings
  if (bookingsSorted.length === 0) {
    availableSlots.push({
      startTime: '00:00',
      endTime: '23:59',
    });
    return availableSlots;
  }
  //time check before first booking
  if (startDay.isBefore(moment(bookingsSorted[0].startTime, 'HH:mm'))) {
    availableSlots.push({
      startTime: startDay.format('HH:mm'),
      endTime: moment(bookingsSorted[0].startTime, 'HH:mm').format('HH:mm'),
    });
  }

  // difference chekc betwwen bookings
  for (let i = 0; i < bookingsSorted.length - 1; i++) {
    const currentBookingEnd = moment(bookingsSorted[i].endTime, 'HH:mm');
    const nextBookingStart = moment(bookingsSorted[i + 1].startTime, 'HH:mm');

    if (currentBookingEnd.isBefore(nextBookingStart)) {
      availableSlots.push({
        startTime: currentBookingEnd.format('HH:mm'),
        endTime: nextBookingStart.format('HH:mm'),
      });
    }
  }

  // check time after the booking
  if (
    moment(bookingsSorted[bookingsSorted.length - 1].endTime, 'HH:mm').isBefore(
      endDay,
    )
  ) {
    availableSlots.push({
      startTime: moment(
        bookingsSorted[bookingsSorted.length - 1].endTime,
        'HH:mm',
      ).format('HH:mm'),
      endTime: '23:59',
    });
  }

  return availableSlots;
};


const conformPayment = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let result;
  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await BookingModel.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: 'paid',
        isBooked: 'confirmed',
      },
      
    );
    message = 'Successfully Paid!';
  } else {
    message = 'Payment Failed!';
  }

  console.log(result);

  let templateForSuccessfulPayment = `
   <html>
  <head>
    <link
      href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #ebf0f5;
    }
    h1 {
      color: #88b04b;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: #404f5e;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: #9abc66;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #c8d0d8;
      display: inline-block;
      margin: 0 auto;
    }

    button {
      background-color: #fb8c00;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      color: white;
      font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        system-ui,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        'Noto Sans',
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji';
      font-size: 20px;
      margin-top: 30px;
      font-weight: 600;
      line-height: 1.25rem;
      padding: 0.75rem 1rem;
      text-align: center;
      -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
    }
  </style>
  <body>
    <div class="card">
      <div
        style="
          border-radius: 200px;
          height: 200px;
          width: 200px;
          background: #f8faf5;
          margin: 0 auto;
        "
      >
        <i class="checkmark">✓</i>
      </div>
      <h1>Payment Successful!</h1>

      <button onclick="window.location.href='';">
        Go To Your Dashboard
      </button>
    </div>
  </body>
</html>

  `;

  const templateForFailedPayment = `
   <html>
  <head>
    <link
      href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #ebf0f5;
    }
    h1 {
      color: red;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: #404f5e;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: red;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #c8d0d8;
      display: inline-block;
      margin: 0 auto;
    }

    button {
      background-color: #fb8c00;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      color: white;
      font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        system-ui,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        'Noto Sans',
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji';
      font-size: 20px;
      margin-top: 30px;
      font-weight: 600;
      line-height: 1.25rem;
      padding: 0.75rem 1rem;
      text-align: center;
      -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
    }
  </style>
  <body>
    <div class="card">
      <div
        style="
          border-radius: 200px;
          height: 200px;
          width: 200px;
          background: #f8faf5;
          margin: 0 auto;
        "
      >
        <i class="checkmark">❌</i>
      </div>
      <h1>Payment Failed!</h1>

      <button onclick="window.location.href='';">
        Go To Homepage
      </button>
    </div>
  </body>
</html>

  `;

  if (message === 'Successfully Paid!') {
    return (templateForSuccessfulPayment = templateForSuccessfulPayment.replace(
      '{{message}}',
      message,
    ));
  }

  if (message === 'Payment Failed!') {
    return templateForFailedPayment.replace('{{message}}', message);
  }
};

export const BookingServices = {
  createBookingFromDB,
  viewAllBookingsFromDB,
  viewAllBookingsByUserFromDB,
  cancelBookingInToDB,
  checkAvailabilityInToDB,
  conformPayment,
};
