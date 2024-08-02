import express from "express";

const router = express.Router();



router.get("/", (req, res) => {
    res.json({"mesage":"There are billions of bookings here"});
});



export default router;