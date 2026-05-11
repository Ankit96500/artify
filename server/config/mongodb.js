import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async(callback)=>{
    try {
        mongoose.connection.on("connected", () => {
            callback();
        })
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log("error", error);
    }
}


export default connectDb;








