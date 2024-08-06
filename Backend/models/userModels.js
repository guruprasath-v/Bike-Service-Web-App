import db from "../config/dbConfig.js";
import resp from "../helpers/backendResponding.js";




const createUser = async (userData) => {
    const { userName, city, displayName, doorNo, postalCode, state, street, userMobile, userPassword, userId, userRole} = userData;
    const query = "INSERT INTO users (userId, userName, userPassword, userMobile, displayName, doorNo, street, city, state, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const values = [userId, userName, userPassword, userMobile, displayName, doorNo, street, city, state, postalCode];
    try{
        await db.execute(query, values);
        return resp(
            200, 
            true, 
            "User Created", 
            "User Created with given Details in DB", 
            '', 
            ''
        )
    }
    catch(err){
        console.log(err)
        if(err.code === "ER_DUP_ENTRY"){
            return resp(
                409, 
                true, 
                "User already exists", 
                "User already exists with the given username", 
                '', 
                "Try again if you're new here or try login"
            )
        }
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't create user now", 
            '', 
            'Try again later'
        )
    }
}


const validateUser = async (userData) => {
    const { userName, userPassword, userRole } = userData;
    const query = "SELECT userName, userPassword, userRole, userId FROM users WHERE userName = ?";
    const values = [userName];
    try{
        const [rows] = await db.execute(query, values);
        if(rows.length > 0){
            return resp(
                200, 
                true, 
                "User Found", 
                "User found with given userName in DB", 
                rows[0], 
                '',
                rows[0].userRole
            )
        }
        else{
            return resp(
                404, 
                false, 
                "User Not Found", 
                "User Can't be found with given userName in DB", 
                '', 
                'You can try checking spelling of user or create new user and try again',
                ''
            )
        }
    }
    catch(err){
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't try out checking", 
            '', 
            'Try again later',
            ''
        )
    }
    
}


const adminBasicFetchPending = async () => {
    const query = `
    SELECT b.bookingId, u.userName, u.displayName, u.userMobile, b.bookedDate, b.state, b.vehicleNo, b.vehicleModel, GROUP_CONCAT(s.servName) AS services
    FROM 
    bookings b
    JOIN 
    users u ON b.userId = u.userId
    JOIN 
   bookings_services bs ON b.bookingId = bs.bookingId
    JOIN 
    services s ON bs.serviceId = s.servId
    WHERE 
    b.state IN ('pending', 'ready-for-delivery')
    GROUP BY 
    b.bookingId, u.userName, b.bookedDate, b.state, b.vehicleNo, b.vehicleModel
    LIMIT 30
    `
    try{
        const [rows] = await db.execute(query);
        if(rows.length>0){
            return resp(
                200, 
                true, 
                "User Bookings fetched", 
                "All Pending bookings fetched", 
                rows, 
                ''
            )
        }else{
            return resp(
                200, 
                false, 
                "No details available", 
                "There is no booked details ", 
                '', 
                ''
            )
        }
    }catch(err){
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't try out checking", 
            '', 
            'Try again later'
        )
    }

}


const customerBookingsFetch = async (userId) => {
    const query = `
    SELECT b.bookingId, u.userName, u.displayName, u.userMobile, b.bookedDate, b.state, b.vehicleNo, b.vehicleModel, GROUP_CONCAT(s.servName) AS services
    FROM bookings b
    JOIN users u ON b.userId = u.userId
    JOIN bookings_services bs ON b.bookingId = bs.bookingId
    JOIN services s ON bs.serviceId = s.servId
    WHERE u.userId = ?
    GROUP BY b.bookingId, u.userName, u.displayName, u.userMobile, b.bookedDate, b.vehicleNo, b.vehicleModel
    `

    try {
        const [rows] = await db.execute(query, [userId]);

        if (rows.length > 0) {
            return resp(
                200,
                true,
                "User Bookings Fetched",
                "All bookings fetched successfully.",
                rows,
                ''
            );
        } else {
            return resp(
                200,
                false,
                "No Details Available",
                "The user has no bookings.",
                [],
                ''
            );
        }
    } catch (err) {
        console.error("Database error:", err); // Log the error for debugging
        return resp(
            500,
            false,
            "Error Connecting to Database",
            "Unable to fetch bookings. Please try again later.",
            '',
            'An unexpected error occurred. Please try again later.'
        );
    }
}


const adminFetchAllBookings = async (queries) => {
    const { startDate, endDate, state } = queries;
    let conditions = [];

    if (startDate && endDate) {
        conditions.push(`b.bookedDate BETWEEN '${startDate}' AND '${endDate}'`);
    } else if (startDate) {
        conditions.push(`b.bookedDate >= '${startDate}'`);
    } else if (endDate) {
        conditions.push(`b.bookedDate <= '${endDate}'`);
    }

    if (state) {
        conditions.push(`b.state = '${state}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT 
            b.bookingId, 
            u.userName, 
            b.bookedDate, 
            b.state, 
            b.vehicleNo, 
            b.vehicleModel, 
            GROUP_CONCAT(s.servName) AS services
        FROM 
            bookings b
        JOIN 
            users u ON b.userId = u.userId
        JOIN 
            bookings_services bs ON b.bookingId = bs.bookingId
        JOIN 
            services s ON bs.serviceId = s.servId
        ${whereClause}
        GROUP BY 
            b.bookingId, u.userName, b.bookedDate, b.state, b.vehicleNo, b.vehicleModel;
    `;

    try {
        const [bookings] = await db.execute(query);
        return resp(200, true, "Bookings Retrieved", "", bookings, "");
    } catch (err) {
        return resp(500, false, "Error Fetching Bookings", err.message, "", "");
    }
}

const findUserName = async (userId) => {
    try{
        const userNameQuery = `SELECT userName, displayName FROM users WHERE userId = ?`;
        const [userDetails] = await db.execute(userNameQuery, [userId]);
        return resp(200, true, "User Name Retrieved", "", userDetails[0], "");
    }catch(e){
        return resp(500, false, "Error Fetching Bookings", e.message, "", "");
    }


}

const findAdminName = async () => {
    try{
        const userNameQuery = `SELECT userName, displayName FROM users WHERE userRole = ?`;
        const [adminDetails] = await db.execute(userNameQuery, ["Admin"]);
        return resp(200, true, "User Name Retrieved", "", adminDetails[0], "");
    }catch(e){
        return resp(500, false, "Error Fetching Bookings", e.message, "", "");
    }
}


export default {
    createUser, 
    validateUser,
    adminBasicFetchPending,
    customerBookingsFetch,
    adminFetchAllBookings,
    findUserName,
    findAdminName,
}