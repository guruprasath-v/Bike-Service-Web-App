import serviceModels from "../models/serviceModels.js";
import resp from "../helpers/backendResponding.js";
import uuidGen from "../helpers/uuidGen.js";

const getServicesController = async (req, res) => {
    const result = await serviceModels.getAllServices();
    if(result.success == true){
        res.status(result.code).json({message:result.message, body:result.body});
    }else{
        res.status(result.code).json({message:result.message, body:''});
    }
}

const createServiceController = async (req, res) => {
    if (Object.keys(req.body).length < 5) {
        return res.status(400).json(resp(400, false, "All fields are required", "Some empty fields are there cant process creation of user","", "Please recheck all your input fields and try again"));
    }
    const servId = uuidGen();
    const servData = {...req.body, servId:servId};
    const result = serviceModels.createNewServices(servData);
    res.status(result.code).json(result);
}

const updateServiceController = async (req, res) => {
    const { id } = req.params;
    const result = await serviceModels.updateService(id, req.body);
    res.status(result.code).json(result);
};

const deleteServiceController = async (req, res) => {
    const { id } = req.params;
    const result = await serviceModels.deleteService(id);
    res.status(result.code).json(result);
};


export default {
    getServicesController,
    createServiceController,
    updateServiceController,
    deleteServiceController
}