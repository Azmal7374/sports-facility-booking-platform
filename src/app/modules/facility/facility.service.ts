import { TFacility } from "./facility.interface";
import { FacilityModel } from "./facility.model";





const createFacilityFromDB = async (payload: TFacility) => {
    const result = await FacilityModel.create(payload);
    return result;
  };
  

  const updateFacilityInToDB =async (id: string, payload:Partial<TFacility>) => {
    const result = await FacilityModel.findOneAndUpdate(
      {_id: id},
      {$set: payload},
      {next: true , runValidators:true}
    )

    if (!result) {
      throw new Error("Facility Not Found!!")
    }
    return result
  };
  
  const deleteFacilityFromDB = async () => {
     
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