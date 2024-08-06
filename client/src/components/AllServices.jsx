import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllServices() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/services`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if(data.message === "Unauthorized" || data.message === "No Token Provided" || data.message === "jwt expired" || data.message === "jwt malformed"){
                    navigate('/');
                }
                setServices(data.body);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError("Failed to fetch services.");
            }
        };

        fetchServices();
    }, []);

    const handleEditClick = (service) => {
        setSelectedService(service);
        setIsPopupOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedService({
            ...selectedService,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/services/${selectedService.servId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(selectedService)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update services list
            setServices(services.map(service => service.servId === selectedService.servId ? selectedService : service));
            setIsPopupOpen(false);
        } catch (err) {
            console.error("Error updating service:", err);
            setError("Failed to update service.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/services/${selectedService.servId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove service from list
            setServices(services.filter(service => service.servId !== selectedService.servId));
            setIsPopupOpen(false);
        } catch (err) {
            console.error("Error deleting service:", err);
            setError("Failed to delete service.");
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <h1>All Services</h1>
            <button type='button' onClick={() => navigate("/users/admin/newservice")}>Create Service ➕ </button>
            {services && services.length === 0 ? (
                <p>No services available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Service ID</th>
                            <th>Name</th>
                            <th>Fee</th>
                            <th>Time Taken</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services && services.map(service => (
                            <tr key={service.servId}>
                                <td>{service.servId}</td>
                                <td>{service.servName}</td>
                                <td>{service.fee}</td>
                                <td>{service.timeTaken}</td>
                                <td>{service.description}</td>
                                <td>{service.category}</td>
                                <td>
                                    <button onClick={() => handleEditClick(service)}>
                                        <span role="img" aria-label="edit">✏️</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isPopupOpen && selectedService && (
                <div className="popup">
                    <h2>Edit Service</h2>
                    <form>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="servName"
                                value={selectedService.servName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Fee:
                            <input
                                type="number"
                                name="fee"
                                value={selectedService.fee}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Time Taken:
                            <input
                                type="text"
                                name="timeTaken"
                                value={selectedService.timeTaken}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={selectedService.description}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Category:
                            <select
                                name="category"
                                value={selectedService.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="General">General</option>
                                <option value="Repair">Repair</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </label>
                        <button type="button" onClick={handleSave}>Save</button>
                        <button type="button" onClick={handleDelete}>Delete</button>
                        <button type="button" onClick={() => setIsPopupOpen(false)}>Close</button>
                    </form>
                </div>
            )}
        </div>
    );
}
