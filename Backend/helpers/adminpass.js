import helpers from "./hashPassword.js";
import db from "../config/dbConfig.js";

const updateUserPassword = async () => {
    const userName = "gsbikes@gmial.com"; // User name to identify which record to update
    const pass = "Admin@123";
    const hashedPassword = await helpers.hashPassword(pass);

    // Update statement
    const query = "UPDATE users SET userPassword = ?, userName = ? WHERE userName = ?";
    const values = [hashedPassword, "gsbikes@gmail.com", userName]; // Parameterized values

    try {
        const [result] = await db.query(query, values);
        console.log(result); // Output the result of the update query
    } catch (err) {
        console.log(err); // Log the error if any
    }
}

updateUserPassword();
