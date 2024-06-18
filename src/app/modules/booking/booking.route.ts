import express from 'express';
import { validateBooking } from './booking.validation';
import validateRequest from '../../middlewares/validateRequest';
import { BookingControllers } from './booking.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
//   auth('user'),
  validateRequest(validateBooking.createBookingValidationSchema),
  BookingControllers.createBooking,
);



router.delete('/:id',);

router.get('/check-availability',);
router.get('/',);

router.get('/user',);

export const BookingRoutes = router;