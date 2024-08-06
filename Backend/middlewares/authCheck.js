import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import resp from "../helpers/backendResponding.js"

const authChecker = (req, res, next) => {
    const token = req.cookies.euuid;
    if(!token){
        return res.status(401).json(resp(401, false, "No Token Provided", "Token not provided in cookies", "", "Please Login or Register your account and try again"));
    }
    jwt.verify(token, process.env.USER_SECRET_KEY, (err, user) => {
        if(err){
            if(err.message === "jwt expired"){
                return res.status(400).json(resp(401, false, "Session Expired", "Your Session on this site has been expired","", "Please login again"))
            }
            if(err.message === "jwt malformed"){
                return res.status(400).json(resp(401, false, "Session Malformed", "Your Session on this site has been blocked","", "Please login again"))
            }
        }
        req.user = user;
        next();
    });
}

export const adminRoleCheck = (req, res, next) => {
    if(req.user.userRole === "Admin"){
        next()
    }else{
        res.status(401).json(resp(401, false, "Unauthorized", "This Section needs Admin access", "", "You're not admin"));
    }
}


export default authChecker;