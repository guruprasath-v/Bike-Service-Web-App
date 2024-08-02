import helpers from "../helpers/hashPassword.js";
import uuidGen from "../helpers/uuidGen.js";
import userModels from "../models/userModels.js";

const createUserController = async (req, res) => {
    // Validate if all required fields are present
    if (Object.keys(req.body).length < 8) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    const userId = uuidGen();
    const userPassword = await helpers.hashPassword(req.body.userPassword);
    const userData = { ...req.body, userId: userId, userPassword: userPassword };

    try {
        const result = await userModels.createUser(userData);
        
        if (result.success === "true") {
            return res.status(201).json({ message: result.message }); // 201 Created status
        } else {
            return res.status(400).json({ error: result.message }); // 400 Bad Request or appropriate status
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" }); // 500 Internal Server Error
    }
}

const userLoginController = async(req, res) => {
    const result = await userModels.validateUser(req.body);
    console.log(result)
    if(result.success === "true") {
        
        return res.status(200).json({message: result.message});
    }else{
        return res.status(400).json({message: result.message});
    }
}

export default {
    createUserController, 
    userLoginController,
}
