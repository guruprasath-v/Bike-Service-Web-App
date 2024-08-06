import express from "express";
import bookingController from "../controllers/bookingController";
import authChecker, { adminRoleCheck } from "../middlewares/authCheck";

const router = express.Router();



router.post("/", authChecker, bookingController.creatBookingController);
router.delete("/:id", authChecker, bookingController.deleteBookingController);
router.put("/:id", authChecker, adminRoleCheck, bookingController.updateBookingStateController);



export default router;