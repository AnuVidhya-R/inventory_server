
//const mongoose =require('mongoose') common.js

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = () => {

try{
    //mongodb://127.0.0.1:27017/sece_todo
    mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongodb connected successfully");
    
}catch(error){
    console.log("Mongodb connection failed", error);
    }
}
export default connectDb;