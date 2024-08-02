import bcrypt from "bcrypt";

const hashPassword = async(password) => {
    return await bcrypt.hash(password, 10);
}

const comparePassword = async (hashedPassword, password) => {
    return await hashPassword(hashedPassword, password);
}  



export default {hashPassword, comparePassword};