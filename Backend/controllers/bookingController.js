import bookingsModels from "../models/bookingsModels";
import userModels from "../models/userModels.js";
import uuidGen from "../helpers/uuidGen";
import emailNotification from "../helpers/mailNotification.js";


const creatBookingController = async (req, res) => {
    const bookingId = uuidGen();
    const bookingData = {...req.body, bookingId:bookingId, userId:req.user.userId};
    const result = bookingsModels.createNewBookingModel(bookingData);
    if(result.success == true){
        const userDetails = userModels.findUserName(req.user.userId);
        const adminDetails = userModels.findAdminName();
        const mailObject = {
            purpose:'u2a',
            from:userDetails.userName,
            to:adminDetails.userName,
            subject:`New Booking Notification - Booking ID: ${bookingId}`,
            text:`Hello Admin ${adminDetails.dispName},

              A new booking has been made by ${userDetails.dispName}.

              Booking Details:
              - Date: ${bookingData.bookedDate}
              - Vehicle No: ${bookingData.vehicleNo}
              - Vehicle Model: ${bookingData.vehicleModel}

              Services Requested:
              ${bookingData.services.join('\n')}

              Please review the booking details and take the necessary actions.`
        }
        const response = await emailNotification(mailObject);
        if(response.success == true){
            res.json(result.code).json(result);
        }
    }else{
        res.status(result.code).json(result)
    }
}

const deleteBookingController = async (req, res) => {
    const { id } = req.params;
    const result = await bookingsModels.deleteBooking(id);
    res.status(result.success ? 200 : 500).json(result);
}

const updateBookingStateController = async (req, res) => {
    const { id } = req.params;
    const bookingData = {bookingId:id, state:req.body.state}
    const response = await bookingsModels.updateBookingState(bookingData);
    if(response.success == true){
        if(bookingData.state === 'ready for delivery'){
            const userDetails = await userModels.findUserName(req.user.userId);
            const adminDetails = await userModels.findAdminName();
            const mailObject = {
                purpose:'a2u',
                from: adminDetails.userName,
                to: userDetails.userName,
                subject: `Your Bike is Ready for Pickup - Booking ID: ${bookingId}`,
                text: `Hello ${userDetails.dispName},
            
                We are pleased to inform you that your bike is ready for pickup. All the requested services have been completed successfully.
            
                Booking Details:
                - Date: ${bookingData.bookedDate}
                - Vehicle No: ${bookingData.vehicleNo}
                - Vehicle Model: ${bookingData.vehicleModel}
            
                Services Completed:
                ${bookingData.services.join('\n')}
            
                Please visit our service center to pick up your bike at your earliest convenience.
            
                Best regards,
                ${adminDetails.dispName}
                GSBIKESERVICE`
            }
            const response = await emailNotification(mailObject);
            if(response.success == true){
                res.json(result.code).json(result);
            }
            
        }else{
            res.status(response.code).json(response)
        }

    }else{
        res.status(response.code).json(response)
    }
}



export default {
    creatBookingController,
    deleteBookingController,
    updateBookingStateController,
}