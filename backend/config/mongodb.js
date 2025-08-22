import mongoose from "mongoose";


const mongoDBConnect = async () =>{
    mongoose.connection.on('connected' , () =>{
        console.log(
      `Database connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    );
    })
    await mongoose.connect(`${process.env.MONGODB_URL}`)
}

export default mongoDBConnect;