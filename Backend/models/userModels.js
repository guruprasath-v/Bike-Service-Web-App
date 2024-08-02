import db from "../config/dbConfig.js";


const createUser = async (userData) => {
    const { userName, city, displayName, doorNo, postalCode, state, street, userMobile, userPassword, userId, userRole} = userData;
    const query = "INSERT INTO users (userId, userName, userPassword, userMobile, displayName, doorNo, street, city, state, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const values = [userId, userName, userPassword, userMobile, displayName, doorNo, street, city, state, postalCode];
    try{
        const [rows] = await db.query(query, values);
        console.log(rows)
        return {"success":"true", "message":"User created successfully"}
    }
    catch(err){
        if(err.code === "ER_DUP_ENTRY"){
            return {"success":"false", "message":"User already exists"}
        }
        return { success: false, message: "Error creating user", error: err.message };
    }
}


const validateUser = async (userData) => {
    const { userName, userPassword } = userData;
    const query = "SELECT userName, userPassword, userId FROM users WHERE userName = ?";
    const values = [userName];
    const [rows] = await db.query(query, values);
    if(rows.length > 0){
        console.log(rows);
        return {"success":"true", "message":"User found"};
    }else{
        return {"error":{
            "code":"400",
            "message":"User not found",
            "description":"Given userName is not a valid user name",
            "suggestedAction":"create a ner user and then try again"
        }}
    }
}



export default {
    createUser, 
    validateUser,
}