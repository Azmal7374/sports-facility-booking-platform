import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';

const BookingSchema = new Schema<TBooking>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  facility: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
  payableAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending'],
    default: 'pending',
  },
  transactionId: { type: String, required: true },
  isBooked: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending',
  },
});

export const BookingModel = model<TBooking>('Booking', BookingSchema);
