import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

// Ensure Modal has an accessible app element
Modal.setAppElement('#root');

export default function AdminDashboard() {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [readyForDeliveryBookings, setReadyForDeliveryBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newState, setNewState] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchBookings = () => {
        fetch(`${process.env.REACT_APP_BASE_URL_API}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.message === "Unauthorized" || data.message === "No Token Provided" || data.message === "jwt expired" || data.message === "jwt malformed"){
                navigate('/');
            }
            const pending = data.body && data.body.length > 0 && data.body.filter(booking => booking.state === 'pending');
            const readyForDelivery = data.body && data.body.length > 0 && data.body.filter(booking => booking.state === 'ready-for-delivery');
            setPendingBookings(pending);
            setReadyForDeliveryBookings(readyForDelivery);
        })
        .catch(err => {
            console.error("Error fetching bookings:", err);
            setError("Failed to fetch bookings.");
        });
    };

    useEffect(() => {
        // Fetch all bookings data when component mounts
        fetchBookings();
    }, []);

    const handleRowClick = (bookingId) => {
        const booking = pendingBookings && pendingBookings.find(b => b.bookingId === bookingId) || readyForDeliveryBookings.find(b => b.bookingId === bookingId);
        setSelectedBooking(booking);
        setNewState(booking.state);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/bookings/${selectedBooking.bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ state: newState })
            });

            const result = await response.json();

            if (result.success) {
                handleCloseModal();
                window.location.reload();  // Reload the page to update counts and bookings
            } else {
                setError("Failed to update booking state.");
            }
        } catch (err) {
            console.error("Error updating booking state:", err);
            setError("Failed to update booking state.");
        }
    };

    const pendingCount = pendingBookings && pendingBookings.length;
    const readyForDeliveryCount = readyForDeliveryBookings && readyForDeliveryBookings.length;

    return (
        <div className="dashboard">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="logo">YourLogo</div>
                <div className="nav-links">
                    <a href="/users/admin" className="nav-link">Dashboard</a>
                    <a href="/users/admin/allbookings" className="nav-link">All Bookings</a>
                    <a href="/users/admin/services" className="nav-link">All Services</a>
                    <a href="/users/logout">Logout</a>
                </div>
            </nav>

            {/* Summary Boxes */}
            <div className="summary-boxes">
                <div className="summary-box">
                    <h3>Pending Bookings</h3>
                    <p>{pendingCount}</p>
                </div>
                <div className="summary-box">
                    <h3>Ready for Delivery Bookings</h3>
                    <p>{readyForDeliveryCount}</p>
                </div>
            </div>

            {/* Booking Sections */}
            <div className="booking-section">
                <h2>Pending Bookings</h2>
                {pendingBookings.length === 0 ? (
                    <p>No pending bookings.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Date</th>
                                <th>State</th>
                                <th>Services Needed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingBookings.map(booking => (
                                <tr className='indStyle' key={booking.bookingId} onClick={() => handleRowClick(booking.bookingId)}>
                                    <td>{booking.bookingId}</td>
                                    <td>{new Date(booking.bookedDate).toLocaleString()}</td>
                                    <td>{booking.state}</td>
                                    <td>{booking.services}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="booking-section">
                <h2>Ready for Delivery Bookings</h2>
                {readyForDeliveryBookings.length === 0 ? (
                    <p>No ready for delivery bookings.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Date</th>
                                <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {readyForDeliveryBookings.map(booking => (
                                <tr className='indStyle' key={booking.bookingId} onClick={() => handleRowClick(booking.bookingId)}>
                                    <td>{booking.bookingId}</td>
                                    <td>{new Date(booking.bookedDate).toLocaleString()}</td>
                                    <td>{booking.state}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal for Booking Details */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Booking Details"
                // className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Booking Details</h2>
                {selectedBooking && (
                    <>
                        <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
                        <p><strong>Date:</strong> {new Date(selectedBooking.bookedDate).toLocaleString()}</p>
                        <p><strong>State:</strong> 
                            <select value={newState} onChange={(e) => setNewState(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="ready-for-delivery">Ready for Delivery</option>
                                <option value="completed">Completed</option>
                            </select>
                        </p>
                        <p><strong>Services Needed:</strong> {selectedBooking.services}</p>
                        <p><strong>Vehicle No:</strong> {selectedBooking.vehicleNo}</p>
                        <p><strong>Vehicle Model:</strong> {selectedBooking.vehicleModel}</p>
                        <p><strong>User Mobile:</strong> {selectedBooking.userMobile}</p>
                        <p><strong>User Name:</strong> {selectedBooking.userName}</p>
                    </>
                )}
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCloseModal}>Close</button>
            </Modal>
        </div>
    );
}
