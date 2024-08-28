import { TFacility } from './facility.interface';
import FacilityModel from './facility.model';

const createFacilityFromDB = async (payload: TFacility) => {
  const result = await FacilityModel.create(payload);
  return result;
};

const updateFacilityInToDB = async (id: string, payload: Partial<TFacility>) => {
  const result = await FacilityModel.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new Error('Facility not found'!);
  }

  return result;
};

const deleteFacilityFromDB = async (id: string) => {
  const result = await FacilityModel.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new Error('Facility not found');
  }

  return result;
};

const getAllFacilityInToDB = async () => {
  const result = await FacilityModel.find({ isDeleted: false });
  return result;
};

const getSingleFacilityDetailsInToDB = async (id: string) => {
  const result = await FacilityModel.findById(id);

  if (!result) {
    throw new Error('Facility not found');
  }

  return result;
};

export const FacilityServices = {
  createFacilityFromDB,
  updateFacilityInToDB,
  deleteFacilityFromDB,
  getAllFacilityInToDB,
  getSingleFacilityDetailsInToDB,
};