import React, { useEffect, useState } from 'react';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- NEW STATE: For confirmation message ---
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [newBooking, setNewBooking] = useState(null);
    // -------------------------------------------

    // IMPORTANT: Get your Render URL from your browser's address bar 
    const RENDER_API_URL = 'https://project-r50m.onrender.com'; 

    // Get the logged-in user's email from Local Storage
    const userEmail = localStorage.getItem('userEmail');

    // Effect to check for new booking confirmation message
    useEffect(() => {
        const confirmed = localStorage.getItem('bookingConfirmed');
        const detailsJson = localStorage.getItem('newBookingDetails');

        if (confirmed === 'true' && detailsJson) {
            const details = JSON.parse(detailsJson);
            
            setConfirmationMessage("✅ Your booking has been successfully placed! Confirmation details below:");
            setNewBooking(details);

            // --- CRITICAL FIX: Clean up localStorage AFTER setting state ---
            localStorage.removeItem('bookingConfirmed');
            localStorage.removeItem('newBookingDetails');
        }
    }, [setNewBooking]); 

    // Effect to fetch user bookings
    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return; // Exit if no user is logged in
        }

        setLoading(true);
        
        fetch(`${RENDER_API_URL}/api/bookings/user/${userEmail}`) 
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                // Ensure the list includes the brand new booking if it was just added
                let finalBookings = data;
                if (newBooking && !data.some(b => b._id === newBooking._id)) {
                    // Prepend the new booking so it shows up at the top of the list
                    finalBookings = [newBooking, ...data]; 
                }
                
                setBookings(finalBookings);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching user bookings:", err);
                setLoading(false);
            });
    }, [userEmail, newBooking]); 

    if (loading) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading My Trips...</h2>;
    }

    if (!userEmail) {
        return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Please log in to see your trips.</h2>;
    }

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center'}}>My Trips</h2>

            {/* --- CONFIRMATION BLOCK (NOW DISPLAYS ALL DETAILS) --- */}
            {confirmationMessage && newBooking && (
                <div style={styles.confirmationBox}>
                    <p style={styles.confirmationText}>{confirmationMessage}</p>
                    <div style={styles.detailsBox}>
                        <p><strong>Customer Name:</strong> {newBooking.customerName}</p>
                        <p><strong>Destination (Venue):</strong> {newBooking.destination}</p>
                        <p><strong>Guests:</strong> {newBooking.guests}</p>
                        <p><strong>Travel Date:</strong> {new Date(newBooking.date).toLocaleDateString()}</p>
                        <p><strong>Phone:</strong> {newBooking.phone}</p>
                        <p><strong>Payment Method:</strong> {newBooking.paymentMethod}</p>
                        <p><strong>Status:</strong> <span style={{color: 'orange', fontWeight: 'bold'}}>{newBooking.status} (Pending Admin Approval)</span></p>
                    </div>
                    <hr style={{margin: '30px 0'}} />
                </div>
            )}
            {/* ---------------------------- */}
            
            <p style={{textAlign: 'center', marginBottom: '30px', color: '#555'}}>Bookings for: **{userEmail}**</p>

            {bookings.length === 0 ? (
                <p style={{textAlign: 'center', fontSize: '18px', color: '#ff5722'}}>
                    You have no active or past bookings.
                </p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>No.</th>
                            <th style={styles.th}>Destination</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Guests</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b, index) => (
                            <tr key={b._id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{b.destination}</td>
                                <td style={styles.td}>{new Date(b.date).toLocaleDateString()}</td>
                                <td style={styles.td}>{b.guests}</td>
                                <td style={{...styles.td, color: b.status === 'Pending' ? 'orange' : b.status === 'Confirmed' ? 'green' : 'red', fontWeight: 'bold'}}>
                                    {b.status}
                                </td>
                                <td style={styles.td}>{b.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '50px auto', padding: '0 20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '16px' },
    th: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { border: '1px solid #ddd', padding: '12px', textAlign: 'left' },
    confirmationBox: {
        backgroundColor: '#e8f5e9',
        border: '1px solid #c8e6c9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center',
    },
    confirmationText: {
        color: 'green',
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '15px'
    },
    detailsBox: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '6px',
        textAlign: 'left',
        display: 'inline-block', 
        margin: '0 auto',
        minWidth: '300px'
    },
};

export default MyBookings;