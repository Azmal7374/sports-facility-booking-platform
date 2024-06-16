import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from 'bcrypt';
import config from "../../config";



const userSchema: Schema = new Schema<TUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'] },
    address: { type: String, required: true },
  });


  userSchema.pre('save', async function (next) {

    const user = this; //document
    //hasing password and save into DB
    user.password = await bcrypt.hash(
      user.password as string,
      Number(config.bcrypt_salt_rounds),
    );
    next();
  });
  

export const UserModel = mongoose.model<TUser>('User', userSchema)