import db from "../config/dbConfig.js";
import resp from "../helpers/backendResponding.js";


const createNewBookingModel = async (bookingData) => {
    const { bookingId, userId, bookedDate, state, vehicleNo, vehicleModel, services } = bookingData;
    const query = "INSERT INTO bookings(bookingId, userId, bookedDate, state, vehicleNo, vehicleModel) VALUES(?, ?, ?, ?, ?, ?)";
    const values = [bookingId, userId, bookedDate, state, vehicleNo, vehicleModel]
    try{
        await db.execute(query, values);
        const serviceNames = services;
        const placeHolders = serviceNames.map(serviceName => '?').join(", ")
        const query_servids = `SELECT servId FROM services WHERE servName IN(${placeHolders})`;
        const [serviceResults] = await db.execute(query_servids, serviceNames);
        const serviceIds = serviceResults.map(row => row.servId);
        const query_bs = "INSERT INTO bookings_services(bookingId, serviceId) VALUES ?";
        const bookings_services = serviceIds.map(servId => [bookingId, servId]);
        await db.execute(query_bs, bookings_services);
        return resp(
            200, 
            true, 
            "Booking Created", 
            "A new Booking created Successfully with provided details", 
            '', 
            ''
        ) 
    }catch(e){
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't create Booking now", 
            '', 
            'Try again later'
        )
    }
}


const deleteBooking = async (bookingId) => {
    try{
        const deleteQuery = "DELETE FROM bookings WHERE bookingId = ?";
        await db.execute(deleteQuery, [bookingId]);
        const servDeleteQuery = "DELETE FROM bookings_services WHERE bookingId = ?";
        await db.execute(servDeleteQuery, [bookingId]);
        return resp(
            200, 
            true, 
            "Booking Deleted", 
            "A Booking Deleted Successfully", 
            '', 
            ''
        )
    } catch(err){
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't create Booking now", 
            '', 
            'Try again later'
        )
    }
}

const updateBookingState = async (bookingData) => {
    const { bookingId, state } = bookingData;
    const updateQuery = "UPDATE bookings SET state = ? WHERE bookingId = ?";
    const queryValues = [state, bookingId];
    try{
        await db.execute(updateQuery, queryValues);
        return resp(
            200, 
            true, 
            "Booking Updated", 
            "A Booking Updated Successfully with the given state", 
            '', 
            ''
        )
    }
    catch(e){
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't create Booking now", 
            '', 
            'Try again later'
        )
    }
    

}

export default {
    createNewBookingModel,
    deleteBooking,
    updateBookingState,
}