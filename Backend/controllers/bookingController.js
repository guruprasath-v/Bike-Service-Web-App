import bookingsModels from "../models/bookingsModels.js";
import userModels from "../models/userModels.js";
import uuidGen from "../helpers/uuidGen.js";
import emailNotification from "../helpers/mailNotification.js";
import serviceModels from "../models/serviceModels.js";


const creatBookingController = async (req, res) => {
    const bookingId = uuidGen();
    const bookingData = {...req.body, bookingId:bookingId, userId:req.user.userId};
    const result = await bookingsModels.createNewBookingModel(bookingData);
    if (result.success === true) {
        try {
          const userDetails = await userModels.findUserName(req.user.userId);
    
          const adminDetails = await userModels.findAdminName();
    
          const mailObject = {
            purpose: 'u2a',
            from: userDetails.body.userName,
            to: adminDetails.body.userName,
            subject: `New Booking Notification - Booking ID: ${bookingId}`,
            text: `Hello Admin ${adminDetails.body.displayName},
    
              A new booking has been made by ${userDetails.body.displayName}.
    
              Booking Details:
              - Date: ${bookingData.bookedDate}
              - Vehicle No: ${bookingData.vehicleNo}
              - Vehicle Model: ${bookingData.vehicleModel}
    
              Services Requested:
              ${bookingData.services.join(', ')}
    
              Please review the booking details and take the necessary actions.`,
          };
    
          const response = await emailNotification(mailObject);
    
          if (response.success === true) {
            res.status(result.code).json(result);
          } else {
            res.status(response.code).json(response);
          }
        } catch (error) {
          console.error('Error in email sending process:', error.message);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      } else {
        res.status(result.code).json(result);
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
    const { userId, bookedDate, vehicleNo, vehicleModel } = response.body;
    if(response.success == true){
        if(bookingData.state === 'ready-for-delivery'){
            const userDetails = await userModels.findUserName(userId);
            const adminDetails = await userModels.findAdminName();
            const mailObject = {
                purpose:'a2u',
                from: adminDetails.body.userName,
                to: userDetails.body.userName,
                subject: `Your Bike is Ready for Pickup - Booking ID: ${id}`,
                text: `Hello ${userDetails.body.dispName},
            
                We are pleased to inform you that your bike is ready for pickup. All the requested services have been completed successfully.
            
                Booking Details:
                - Date: ${bookedDate}
                - Vehicle No: ${vehicleNo}
                - Vehicle Model: ${vehicleModel}
            
                Services Completed:
                -All Requested services Completed
            
                Please visit our service center to pick up your bike at your earliest convenience.
            
                Best regards,
                ${adminDetails.dispName}
                GSBIKESERVICE`
            }
            console.log(mailObject);
            const response = await emailNotification(mailObject);
            if(response.success == true){
                res.status(response.code).json(response);
            }
            
        }else{
            res.status(response.code).json(response)
        }

    }else{
        res.status(response.code).json(response)
    }
}

// const availablityBookingsController = async (req, res) => {
//     const dates = dateGen();
//     const availablity = await bookingsModels.availableBookingsCounts(dates);
//     console.log(availablity);
//     const services = await serviceModels.getAllServices();
//     console.log(services)
//     res.status(availablity.code).json(availablity.body, services.body);
// }

const availablityBookingsController = async (req, res) => {
    try {
        const services = await serviceModels.getAllServices();
        
        // Combining the two responses into one
        const Response = {
            services
        };
        
        res.status(200).json(Response);
    } catch (error) {
        console.error('Error in availablityBookingsController:', error);
        res.status(500).json({
            code: 500,
            success: false,
            message: 'Error in connecting to database',
            description: "Can't create Booking now",
            body: '',
            suggestedAction: 'Try again later'
        });
    }
};




export default {
    creatBookingController,
    deleteBookingController,
    updateBookingStateController,
    availablityBookingsController,
}