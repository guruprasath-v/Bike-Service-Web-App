import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

// Ensure Modal has an accessible app element
Modal.setAppElement('#root');

export default function UserDashboard() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        // Fetch bookings data when component mounts
        fetch(`${process.env.REACT_APP_BASE_URL_API}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Unauthorized" || data.message === "No Token Provided" || data.message === "jwt expired" || data.message === "jwt malformed") {
                navigate('/');
            }
            setBookings(data.body);
        })
        .catch(err => {
            console.error("Error fetching bookings:", err);
            setError("Failed to fetch bookings.");
        });
    }, []);

    const handleRowClick = (bookingId) => {
        const booking = bookings.find(b => b.bookingId === bookingId);
        setSelectedBooking(booking);
        setIsModalOpen(true);
        console.log('Booking selected:', booking);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
        console.log('Modal closed');
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/bookings/${selectedBooking.bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                setBookings(bookings && bookings.filter(b => b.bookingId !== selectedBooking.bookingId));
                handleCloseModal();
            } else {
                setError("Failed to delete booking.");
            }
        } catch (err) {
            console.error("Error deleting booking:", err);
            setError("Failed to delete booking.");
        }
    };

    // Categorize bookings
    const currentBookings = bookings && bookings.filter(b => b.state === 'pending' || b.state === 'ready for delivery');
    const pastBookings = bookings && bookings.filter(b => b.state === 'completed');

    // Summary counts
    const currentCount = currentBookings.length || 0;
    const completedCount = pastBookings.length || 0;

    return (
        <div className="dashboard">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="logo">YourLogo</div>
                <div className="nav-links">
                    <a href="/users/me" className="nav-link">Dashboard</a>
                    <a href="/users/me/bookservice" className="nav-link">Book-Service</a>
                    <a href="/users/logout">Logout</a>
                </div>
            </nav>

            {/* Summary Boxes */}
            <div className="summary-boxes">
                <div className="summary-box">
                    <h3>Current Bookings</h3>
                    <p>{currentCount}</p>
                </div>
                <div className="summary-box">
                    <h3>Completed Bookings</h3>
                    <p>{completedCount}</p>
                </div>
            </div>

            {/* Booking Sections */}
            <div className="booking-section">
                <h2>Current Bookings</h2>
                {currentBookings.length === 0 ? (
                    <p>No current bookings.</p>
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
                            {currentBookings.map(booking => (
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
                <h2>Past Bookings</h2>
                {pastBookings.length === 0 ? (
                    <p>No past bookings.</p>
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
                            {pastBookings.map(booking => (
                                <tr key={booking.bookingId} onClick={() => handleRowClick(booking.bookingId)}>
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
                        <p><strong>State:</strong> {selectedBooking.state}</p>
                        <p><strong>Services Needed:</strong> {selectedBooking.services}</p>
                        <p><strong>Vehicle No:</strong> {selectedBooking.vehicleNo}</p>
                        <p><strong>Vehicle Model:</strong> {selectedBooking.vehicleModel}</p>
                        <p><strong>User Mobile:</strong> {selectedBooking.userMobile}</p>
                        <p><strong>User Name:</strong> {selectedBooking.userName}</p>
                    </>
                )}
                <button onClick={handleDelete}>Delete Booking</button>
                <button onClick={handleCloseModal}>Close</button>
            </Modal>
        </div>
    );
}
