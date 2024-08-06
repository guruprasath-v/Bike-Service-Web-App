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
// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend origin
    credentials: true, // Allow credentials (cookies, HTTP authentication)
}));
app.use(cookieParser());

app.use((req, res, next)=>{
    console.log("Request received at: ", new Date());
    next();
})





app.listen(process.env.PORT, (err)=>{
    if(err){
        console.log("Error listening on the port:", err);
    }else{
        console.log("Connected on the port: ", process.env.PORT);
    }
});

app.use("/api/users", userRouter);
app.use('/api/services', serviceRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/auth/logout', (req, res) => {
    res.clearCookie('euuid').send({ success: true });
});