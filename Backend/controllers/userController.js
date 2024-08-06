import helpers from "../helpers/hashPassword.js";
import uuidGen from "../helpers/uuidGen.js";
import userModels from "../models/userModels.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import resp from "../helpers/backendResponding.js"

dotenv.config();



const createUserController = async (req, res) => {
    // Validate if all required fields are present
    if (Object.keys(req.body).length < 10) {
        return res.status(400).json(resp(400, false, "All fields are required", "Some empty fields are there cant process creation of user","", "Please recheck all your input fields and try again"));
    }
    
    const userId = uuidGen();
    const userPassword = await helpers.hashPassword(req.body.userPassword);
    const userData = { ...req.body, userId: userId, userPassword: userPassword };
    const result = await userModels.createUser(userData);
    res.status(result.code).json(result);
}

const userLoginController = async(req, res) => {
    const result = await userModels.validateUser(req.body);
    if(result.success === true) { 
        const passwordValidate = await helpers.comparePassword(req.body.userPassword, result.body.userPassword);
        if(passwordValidate){
            const token = jwt.sign({userId:result.body.userId, userRole:result.body.userRole}, process.env.USER_SECRET_KEY, {expiresIn: "1day"});
            res.cookie("euuid", token, {httpOnly: true, secure:false, sameSite:'lax'});
            return res.status(result.code).json({...result, body:"", message:"User Logged in successfully"});
        }else{
            return res.status(401).json(resp(401, false, "Invalid Password", "The given password is incorrect","", "Please check your password and spelling and try again"));
        }
    }else{
        return res.status(result.code).json({...result, body:""});
    }
}

const userDetailsController = async(req, res) => {
    if(req.user.userRole === "Admin"){
        const result = await userModels.adminBasicFetchPending(req.user.userId);
        res.status(result.code).json(result);
    }
    if(req.user.userRole === "Customer"){
        const result = await userModels.customerBookingsFetch(req.user.userId);
        res.status(result.code).json(result);
    }
}


const viewAllBookingsAdminController = async(req, res) => {
    const queries = {
        startDate: req.query.startDate || "",
        endDate: req.query.endDate || "",
        state: req.query.state || "",
    }
    const result = await userModels.adminFetchAllBookings(queries);
    res.status(result.code).json(result);
}


export default {
    createUserController, 
    userLoginController,
    userDetailsController,
    viewAllBookingsAdminController
}
