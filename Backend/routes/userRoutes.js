import express from "express";
import userController from "../controllers/userController.js"
const router = express.Router();



router.post("/", userController.createUserController);
router.post("/login", userController.userLoginController);


export default router;