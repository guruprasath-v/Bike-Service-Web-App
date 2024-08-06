import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

// Ensure Modal has an accessible app element
Modal.setAppElement('#root');

export default function AllBookings() {
    const [bookings, setBookings] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newState, setNewState] = useState('');
    const navigate = useNavigate();

    const fetchBookings = () => {
        const query = new URLSearchParams();
        if (startDate) query.append('startDate', startDate.toISOString().split('T')[0]);
        if (endDate) query.append('endDate', endDate.toISOString().split('T')[0]);
        if (status) query.append('state', status);

        fetch(`${process.env.REACT_APP_BASE_URL_API}/users/bookings/all?${query.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.message === "Unauthorized" || data.message === "No Token Provided" || data.message === "jwt expired" || data.message === "jwt malformed"){
                navigate('/');
            }
            setBookings(data.body);
        })
        .catch(err => {
            console.error("Error fetching bookings:", err);
            setError("Failed to fetch bookings.");
        });
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleRowClick = (bookingId) => {
        const booking = bookings.find(b => b.bookingId === bookingId);
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
                // Update booking state locally
                const updatedBookings = bookings.map(booking => 
                    booking.bookingId === selectedBooking.bookingId ? { ...booking, state: newState } : booking
                );
                setBookings(updatedBookings);
                handleCloseModal();
            } else {
                setError("Failed to update booking state.");
            }
        } catch (err) {
            console.error("Error updating booking state:", err);
            setError("Failed to update booking state.");
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchBookings();
    };

    return (
        <div className="all-bookings">
            <form className="filter-form" onSubmit={handleFilterSubmit}>
                <div>
                    <label>Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div>
                    <label>End Date:</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <div>
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="ready-for-delivery">Ready for Delivery</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <button type="submit">Filter</button>
            </form>

            <div className="booking-list">
                {bookings && bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>User Name</th>
                                <th>Booked Date</th>
                                <th>Status</th>
                                <th>Vehicle No</th>
                                <th>Vehicle Model</th>
                                <th>Services</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings && bookings.map(booking => (
                                <tr className='indStyle' key={booking.bookingId} onClick={() => handleRowClick(booking.bookingId)}>
                                    <td>{booking.bookingId}</td>
                                    <td>{booking.userName}</td>
                                    <td>{booking.bookedDate}</td>
                                    <td>{booking.state}</td>
                                    <td>{booking.vehicleNo}</td>
                                    <td>{booking.vehicleModel}</td>
                                    <td>{booking.services}</td>
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
