import express from "express";
import serviceControllers from "../controllers/serviceController.js";
import authChecker, { adminRoleCheck } from "../middlewares/authCheck.js";

const router = express.Router();



router.get("/", authChecker, adminRoleCheck, serviceControllers.getServicesController);
router.post("/", authChecker, adminRoleCheck, serviceControllers.createServiceController);
router.put("/:id", authChecker, adminRoleCheck, serviceControllers.updateServiceController);
router.delete("/:id", authChecker, adminRoleCheck, serviceControllers.deleteServiceController);



export default router;