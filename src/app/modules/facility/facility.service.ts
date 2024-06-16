import { TFacility } from "./facility.interface";
import { FacilityModel } from "./facility.model";





const createFacilityFromDB = async (payload: TFacility) => {
    const result = await FacilityModel.create(payload);
    return result;
  };
  

  const updateFacilityInToDB = async () => {
   
  };
  
  const deleteFacilityFromDB = async (id: string) => {
    
  };
  
  const getAllFacilityInToDB = async () => {
    const result = await FacilityModel.find();
    return result;
  };





  export const FacilityServices = {
    createFacilityFromDB, 
    updateFacilityInToDB,
    deleteFacilityFromDB,
    getAllFacilityInToDB
  };