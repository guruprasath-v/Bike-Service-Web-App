import { useState } from "react";
import {useNavigate} from "react-router-dom";
export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        doorNo: "",
        street: "",
        city: "",
        state: "",
        pincode: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEvent = (e) => {
        e.preventDefault();
        const { name, email, password, phone, doorNo, street, city, state, pincode } = formData;
        const submissionData = {
            userName: email,
            userPassword: password,
            displayName: name,
            userMobile: phone,
            doorNo: doorNo,
            street: street,
            city: city,
            state: state,
            postalCode: pincode
        };

        fetch(`${process.env.REACT_APP_BASE_URL_API}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData),
            credentials: 'include'
        }).then(async mess => {
            const respoMess = await mess.json();
            console.log(respoMess);
            if (mess.status !== 200) {
                setError(respoMess.message);
                setTimeout(() => {
                    setError("");
                }, 3000);
            }else{
                navigate("/auth/login");
            }
        });

        setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            doorNo: "",
            street: "",
            city: "",
            state: "",
            pincode: ""
        });
    };

    return (
        <form onSubmit={handleEvent}>
            <div>
                <h2>User Details</h2>
                <label htmlFor="name">Name </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />
                <label htmlFor="password">Password </label>
                <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                />
            </div>
            <div>
                <h2>Contact Details</h2>
                <label htmlFor="email">Email </label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter registered mailId"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
                {error && <p>{error}</p>}
                <label htmlFor="phone">Mobile </label>
                <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    onChange={handleChange}
                />
            </div>
            <div>
                <h2>Address Details</h2>
                <label htmlFor="doorNo">Door No</label>
                <input
                    type="text"
                    name="doorNo"
                    required
                    value={formData.doorNo}
                    placeholder="Your Door No"
                    onChange={handleChange}
                />
                <label htmlFor="street">Street</label>
                <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    placeholder="Your Street"
                    onChange={handleChange}
                />
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    placeholder="Your City"
                    onChange={handleChange}
                />
                <label htmlFor="state">State</label>
                <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    placeholder="Your State"
                    onChange={handleChange}
                />
                <label htmlFor="pincode">Pin Code</label>
                <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    placeholder="Your Pincode"
                    maxLength={6}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Register</button>
        </form>
    );
}
