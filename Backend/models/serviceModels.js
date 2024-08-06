import db from "../config/dbConfig.js";
import resp from "../helpers/backendResponding.js";

const getAllServices = async () => {
    const query = "SELECT * FROM services LIMIT 10";
    try{
        const [services] = await db.execute(query);
        if(services.length > 0){
            return resp(
                200, 
                true, 
                "Services Fetched", 
                "All Services fetched", 
                services, 
                ''
            )
        }
    }
    catch(e){
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't fetch services now", 
            '', 
            'Try again later'
        )
    }
    
}

const createNewServices = async (serviceData) => {
    const { servId, servName, fee, timeTaken, description, category } = serviceData;
    const query = "INSERT INTO services (servId, servName, fee, timeTaken, description, category) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [servId, servName, fee, timeTaken, description, category]
    try{
        await db.execute(query, values);
        return resp(
            200, 
            true, 
            "Service Created", 
            "A new service created Successfully with provided details", 
            '', 
            ''
        ) 
    }catch(err){
        return resp(
            500, 
            false, 
            "Error in connecting to database", 
            "Can't create Service now", 
            '', 
            'Try again later'
        )
    }
}

const updateService = async (id, serviceData) => {
    const { servName, fee, timeTaken, description, category } = serviceData;
    const query = "UPDATE services SET servName = ?, fee = ?, timeTaken = ?, description = ?, category = ? WHERE servId = ?";
    const values = [servName, fee, timeTaken, description, category, id];
    try {
        await db.execute(query, values);
        return resp(
            200,
            true,
            "Service Updated",
            "Service details updated successfully",
            '',
            ''
        );
    } catch (err) {
        return resp(
            500,
            false,
            "Error in connecting to database",
            "Can't update service now",
            '',
            'Try again later'
        );
    }
};

const deleteService = async (id) => {
    const query = "DELETE FROM services WHERE servId = ?";
    try {
        await db.execute(query, [id]);
        return resp(
            200,
            true,
            "Service Deleted",
            "Service deleted successfully",
            '',
            ''
        );
    } catch (err) {
        return resp(
            500,
            false,
            "Error in connecting to database",
            "Can't delete service now",
            '',
            'Try again later'
        );
    }
};


export default  {
    getAllServices,
    createNewServices,
    updateService,
    deleteService
}