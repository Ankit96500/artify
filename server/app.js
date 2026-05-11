import e from "express";
import cors from "cors";
import connectDb from "./config/mongodb.js";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "../server/routes/user-route.js"
import imageRoutes from "../server/routes/image-routes.js"



const PORT  = process.env.PORT || 4000;

const app = e();

app.use(cors({
    origin:['http://localhost:5173/','http://localhost:4173/','https://artify-client-3vez.onrender.com']
}));
app.use(e.json());

// routes
app.use('/api/user',userRoutes);
app.use('/api/image',imageRoutes);


app.get('/',(req,res)=>{
    res.send('API Working...')
});

await connectDb(()=>{console.log("MongoDB connected")});

app.listen(PORT, ()=>{console.log(`Server is running on port ${PORT}`)});



















