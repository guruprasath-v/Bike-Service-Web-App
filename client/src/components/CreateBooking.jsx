import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";

export default function CreateBooking() {
    const [startDate, setStartDate] = useState(new Date());
    const [services, setServices] = useState([]);
    const [vehicleNo, setVehicleNo] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/services`, {
                    credentials: 'include'
                });

                // Check if the response is not empty
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if(data.message === "Unauthorized" || data.message === "No Token Provided" || data.message === "jwt expired" || data.message === "jwt malformed"){
                    navigate('/');
                }
                // Validate JSON response
                if (data && data.body) {
                    setServices(data.body);
                } else {
                    throw new Error('Invalid JSON response');
                }
            } catch (err) {
                console.error("Error fetching111 data:", err);
                setError("Failed to fetch data.");
            }
        };

        fetchData();
    }, []);



    const handleServiceChange = (serviceName) => {
        setSelectedServices(prev => 
            prev.includes(serviceName) 
            ? prev.filter(name => name !== serviceName)
            : [...prev, serviceName]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const bookingDetails = {
            bookedDate: startDate.toISOString().split('T')[0],
            state: 'pending', // Default state for new bookings
            vehicleNo,
            vehicleModel,
            services: selectedServices
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(bookingDetails),
            });
            const result = await response.json();

            if (result.success) {
                navigate('/users/me'); // Redirect to user dashboard after successful booking
            } else {
                setError(result.message || "Failed to create booking.");
            }
        } catch (err) {
            console.error("Error creating booking:", err);
            setError("Failed to create booking.");
        }
    };

    return (
        <div className="create-booking-container">
            <h1>Create Booking</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Booking Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div>
                    <label>Vehicle Number:</label>
                    <input
                        type="text"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Vehicle Model:</label>
                    <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <h2>Select Services</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Description</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services && services.map(service => (
                                <tr key={service.servId}>
                                    <td>{service.servName}</td>
                                    <td>{service.description}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onClick={() => handleServiceChange(service.servName)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="submit">Submit Booking</button>
            </form>
        </div>
    );
}
