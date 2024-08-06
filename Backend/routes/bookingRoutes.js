import express from "express";
import bookingController from "../controllers/bookingController.js";
import authChecker, { adminRoleCheck } from "../middlewares/authCheck.js";

const router = express.Router();


router.post("/", authChecker, bookingController.creatBookingController);
// router.get("/availablity", authChecker, bookingController.availablityBookingsController);
router.delete("/:id", authChecker, bookingController.deleteBookingController);
router.put("/:id", authChecker, adminRoleCheck, bookingController.updateBookingStateController);




export default router;