import React, { useState } from 'react';
const { useNavigate } = require('react-router-dom');

export default function CreateService() {
    const navigate = useNavigate();
    const [servName, setServName] = useState('');
    const [fee, setFee] = useState('');
    const [timeTaken, setTimeTaken] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General'); // Default value
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newService = {
            servName,
            fee,
            timeTaken,
            description,
            category
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newService)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if(result.message === "Unauthorized" || result.message === "No Token Provided" || result.message === "jwt expired" || result.message === "jwt malformed"){
                navigate('/');
            }
            setSuccess('Service created successfully!');
            // Reset form fields
            setServName('');
            setFee('');
            setTimeTaken('');
            setDescription('');
            setCategory('General'); // Reset to default value
            navigate('/users/admin');
        } catch (err) {
            console.error("Error creating service:", err);
            setError('Failed to create service.');
        }
    };

    return (
        <div>
            <h1>Create Service</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={servName}
                        onChange={(e) => setServName(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Fee:
                    <input
                        type="number"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Time Taken:
                    <input
                        type="text"
                        value={timeTaken}
                        onChange={(e) => setTimeTaken(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Category:
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="General">General</option>
                        <option value="Repair">Repair</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </label>
                <br />
                <button type="submit">Create Service</button>
            </form>
        </div>
    );
}
