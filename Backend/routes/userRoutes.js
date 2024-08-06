import express from "express";
import userController from "../controllers/userController.js";
import authChecker, { adminRoleCheck } from "../middlewares/authCheck.js";
const router = express.Router();




router.post("/", userController.createUserController);
router.post("/login", userController.userLoginController);
router.get("/me", authChecker, userController.userDetailsController);
router.get("/bookings/all", authChecker, adminRoleCheck, userController.viewAllBookingsAdminController);


export default router;