
import mongoose from "mongoose";
import dotenv from 'dotenv';
    dotenv.config();


export const connect_db = async () => {
    const res = await mongoose.connect(process.env.MONGO_URL);

      res
      ?console.log('connection with db established')
      :console.log('connection with db not  established')
}