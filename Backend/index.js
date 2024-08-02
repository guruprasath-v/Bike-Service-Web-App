import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());




app.listen(process.env.PORT, (err)=>{
    if(err){
        console.log("Error listening on the port:", err);
    }else{
        console.log("Connected on the port: ", process.env.PORT);
    }
});


app.use("/users", userRouter);
app.use('/bookings', bookingRouter);
app.use('/services', serviceRouter);