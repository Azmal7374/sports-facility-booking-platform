import{ Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';

const BookingSchema= new Schema<TBooking>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  user: { type: Schema.Types.ObjectId,  required: true },
  facility: { type: Schema.Types.ObjectId, required: true },
  payableAmount: { type: Number, required: true },
  isBooked: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
  },
});

export const BookingModel =model<TBooking>('Booking', BookingSchema);