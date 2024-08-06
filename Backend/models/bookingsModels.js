import db from "../config/dbConfig.js";
import resp from "../helpers/backendResponding.js";






const createNewBookingModel = async (bookingData) => {

    const { bookingId, userId, bookedDate, state, vehicleNo, vehicleModel, services } = bookingData;
    const query = "INSERT INTO bookings(bookingId, userId, bookedDate, state, vehicleNo, vehicleModel) VALUES(?, ?, ?, ?, ?, ?)";
    const values = [bookingId, userId, bookedDate, state, vehicleNo, vehicleModel]
    try{
        await db.execute(query, values);
        const serviceNames = services;

        const placeHolders = serviceNames.map(serviceName => '?').join(", ");

        const query_servids = `SELECT servId FROM services WHERE servName IN(${placeHolders})`;
        const [serviceResults] = await db.execute(query_servids, serviceNames);

        const serviceIds = serviceResults.map(row => row.servId);

        const query_bs = "INSERT INTO bookings_services(bookingId, serviceId) VALUES ?";
        const bookings_services = serviceIds.map(servId => [bookingId, servId]);
        await db.query(query_bs, [bookings_services]);

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
        console.log(bookingId);
        const servDeleteQuery = "DELETE FROM bookings_services WHERE bookingId = ?";
        await db.execute(servDeleteQuery, [bookingId]);
        const deleteQuery = "DELETE FROM bookings WHERE bookingId = ?";
        await db.execute(deleteQuery, [bookingId]);
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
    const userIdQuery = "SELECT u.userId, b.bookedDate, b.vehicleNo, b.vehicleModel FROM bookings b JOIN users u ON b.userId = u.userId WHERE bookingId = ?";
    const userQueryValues = [bookingId];
    try{
        await db.execute(updateQuery, queryValues);
        const [userId] = await db.execute(userIdQuery, userQueryValues);
        return resp(
            200, 
            true, 
            "Booking Updated", 
            "A Booking Updated Successfully with the given state", 
            userId[0], 
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

// const availableBookingsCounts = async (dateRanges) => {
//     try{
//         console.log(0);
//         const query1 = `CREATE TEMPORARY TABLE DateRange (bookingDate DATE)`;
//         await db.execute(query1);
//         console.log(1);
//         console.log(dateRanges)
//         const query2 = `INSERT INTO DateRange (bookingDate) VALUES ?`;
//         const values = new String(dateRanges).split(',').map(date => [date]);
//         console.log(values);
//         await db.execute(query2, [values]);
//         console.log(3);
//         const query3 = `
//                 SELECT
//                     d.bookingDate AS date,
//                     CASE
//                         WHEN COUNT(b.bookedDate) < 20 THEN 'yes'
//                         ELSE 'no'
//                     END AS isFilled
//                 FROM
//                     DateRange d
//                 LEFT JOIN
//                     bookings b ON DATE(b.bookedDate) = d.bookingDate
//                 GROUP BY
//                     d.bookingDate
//                 ORDER BY
//                     d.bookingDate
//             `;
//         const[availablity] = await db.execute(query3);
//         console.log(4);
//         const query4 = `DROP TABLE DateRange`;
//         await db.execute(query4);
//         return  resp(
//             200, 
//             true, 
//             "Availablity fetched", 
//             "", 
//             availablity, 
//             ''
//         )
//     }catch(e){
//         return resp(
//             500, 
//             false, 
//             "Error in connecting to database", 
//             "Can't create Booking now", 
//             '', 
//             'Try again later'
//         )
//     }
// }





export default {
    createNewBookingModel,
    deleteBooking,
    updateBookingState,
}