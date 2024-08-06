import bcrypt from "bcrypt";

const hashPassword = async(password) => {
    return await bcrypt.hash(password, 10);
}

const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch ? isMatch : false;
}  



export default {hashPassword, comparePassword};