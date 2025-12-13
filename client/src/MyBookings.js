import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // IMPORTANT: Get your Render URL
    const RENDER_API_URL = 'https://project-r50m.onrender.com'; 

    // Get the logged-in user's credentials from Local Storage
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token'); // <-- CRITICAL: Get the token

    useEffect(() => {
        if (!userEmail || !token) { // Ensure both email and token are present
            setLoading(false);
            if (!userEmail) {
                // If email is missing (but token might not be), redirect to login for safety
                navigate('/login');
            }
            return; 
        }

        setLoading(true);
        
        // Fetch bookings using the user's email in the path
        fetch(`${RENDER_API_URL}/api/bookings/user/${userEmail}`, {
            method: 'GET',
            headers: {
                // CRITICAL FIX: Send the JWT token in the Authorization header
                'Authorization': `Bearer ${token}`, 
            },
        }) 
        .then(res => {
            if (!res.ok) {
                // Handle 401 Unauthorized specifically
                if (res.status === 401) {
                    throw new Error('Unauthorized. Please log in again.');
                }
                throw new Error('Failed to fetch bookings. Server error.');
            }
            return res.json();
        })
        .then(data => {
            setBookings(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching user bookings:", err.message);
            alert(`Error: ${err.message}`); // Inform the user about the specific error
            setLoading(false);
        });
    }, [userEmail, token, navigate]); // Depend on userEmail and token

    if (loading) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading My Trips...</h2>;
    }

    if (!userEmail || !token) {
        return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Session expired. Please log in to see your trips.</h2>;
    }

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center'}}>My Trips</h2>
            <p style={{textAlign: 'center', marginBottom: '30px', color: '#555'}}>Bookings for: **{userEmail}**</p>

            {bookings.length === 0 ? (
                <p style={{textAlign: 'center', fontSize: '18px', color: '#ff5722'}}>
                    You have no active or past bookings.
                </p>
            ) : (
                <div style={{overflowX: 'auto'}}> 
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>No.</th>
                                <th style={styles.th}>Destination (Guests)</th>
                                <th style={styles.th}>Travel Date</th>
                                <th style={styles.th}>Total Price</th>
                                <th style={styles.th}>Payment Method / TxID</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b, index) => (
                                <tr key={b._id}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td style={styles.td}>{b.destination} ({b.guests})</td>
                                    <td style={styles.td}>{new Date(b.date).toLocaleDateString()}</td>
                                    
                                    {/* FIX: Display the price */}
                                    <td style={{...styles.td, fontWeight: 'bold'}}>{b.totalPrice ? b.totalPrice.toLocaleString() + ' BDT' : 'N/A'}</td>

                                    {/* FIX: Display verification details */}
                                    <td style={styles.td}>
                                        **{b.paymentMethod}** <br/>
                                        TxID: *{b.transactionId || 'Awaiting Payment'}*
                                    </td>
                                    
                                    {/* DYNAMIC STATUS DISPLAY */}
                                    <td style={{...styles.td, color: b.status === 'Pending' ? 'orange' : b.status === 'Confirmed' ? 'green' : 'red', fontWeight: 'bold'}}>
                                        {b.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '1000px', margin: '50px auto', padding: '0 20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '15px', minWidth: '700px' },
    th: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { border: '1px solid #ddd', padding: '12px', textAlign: 'left' },
};

export default MyBookings;