import { RequestHandler } from 'express';
import { FacilityServices } from './facility.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createFacility: RequestHandler = async (req, res, next) => {
  try {
    const result = await FacilityServices.createFacilityFromDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Facility added succesfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateFacility: RequestHandler = async (req, res, next) => {
  try {
    const result = await FacilityServices.updateFacilityInToDB(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Facilities Updated successfully!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFacility: RequestHandler = async (req, res, next) => {
  try {
    const result = await FacilityServices.deleteFacilityFromDB(req.params.id);
    //  console.log(result);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Facilities Deleted successfully!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFacility: RequestHandler = async (req, res, next) => {
  try {
    const result = await FacilityServices.getAllFacilityInToDB();
    return res.status(result.length === 0 ? 404 : 200).json({
      success: result.length === 0 ? false : true,
      statusCode: result.length === 0 ? 404 : 200,
      message:
        result.length === 0
          ? 'No Data Found'
          : 'Facilities retrieved successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleFacilityDetails: RequestHandler = async (req, res, next) => {
  try {
    const result = await FacilityServices.getSingleFacilityDetailsInToDB(
      req.params.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Facilities Details Retrive successfully!!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const FacilityControllers = {
  createFacility,
  updateFacility,
  deleteFacility,
  getAllFacility,
  getSingleFacilityDetails,
};
