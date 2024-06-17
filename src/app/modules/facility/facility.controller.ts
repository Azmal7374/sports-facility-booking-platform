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
  
};

const deleteFacility: RequestHandler = async (req, res, next) => {
 
};

const getAllFacility: RequestHandler = async (req, res, next) => {

  const result = await FacilityServices.getAllFacilityInToDB()
     if (result.length === 0){
      sendResponse(res,{
        statusCode: 404,
        success: true,
        message: 'No Data Found',
        data: result,
      })
     }
  sendResponse(res, {
    success:true,
      statusCode:200,
      message:'Facilities retrieved successfully',
      data: result,
  });
   
};

export const FacilityControllers = {
  createFacility,
  updateFacility,
  deleteFacility,
  getAllFacility,
};