import express from 'express';
import { FacilityControllers } from './facility.controller';
import validateRequest from '../../middlewares/validateRequest';
import { Facilityvalidation } from './facility.validate';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(Facilityvalidation.CreateFacilityvalidationSchema),
  FacilityControllers.createFacility,
);

router.put(
  '/:id',
  auth('admin'),
  validateRequest(Facilityvalidation.UpdateFacilityvalidationSchema),
  FacilityControllers.updateFacility,
);

router.delete('/:id', auth('admin'), FacilityControllers.deleteFacility);

router.get('/', FacilityControllers.getAllFacility);

export const FacilityRoutes = router;
