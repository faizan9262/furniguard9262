import mongoose from "mongoose";
import logger from "../utils/logger.js";


const mongoDBConnect = async () =>{
    mongoose.connection.on('connected' , () =>{
        logger.info(
      `Database connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    );
    })
    await mongoose.connect(`${process.env.MONGODB_URL}`)
}

export default mongoDBConnect;