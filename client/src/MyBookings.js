import React, { useEffect, useState } from 'react';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // IMPORTANT: Get your Render URL from your browser's address bar 
    const RENDER_API_URL = 'https://project-r50m.onrender.com'; 

    // Get the logged-in user's email from Local Storage
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return; 
        }

        setLoading(true);
        
        // Fetch bookings using the user's email in the path
        fetch(`${RENDER_API_URL}/api/bookings/user/${userEmail}`) 
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching user bookings:", err);
                setLoading(false);
            });
    }, [userEmail]); // Fetch runs every time the component mounts or user changes

    if (loading) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading My Trips...</h2>;
    }

    if (!userEmail) {
        return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Please log in to see your trips.</h2>;
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
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>No.</th>
                            <th style={styles.th}>Destination (Venue)</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Guests</th>
                            <th style={styles.th}>Payment Method</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b, index) => (
                            <tr key={b._id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{b.destination}</td>
                                <td style={styles.td}>{new Date(b.date).toLocaleDateString()}</td>
                                <td style={styles.td}>{b.guests}</td>
                                <td style={styles.td}>{b.paymentMethod}</td>
                                {/* --- CRITICAL FIX: DYNAMIC STATUS DISPLAY --- */}
                                <td style={{...styles.td, color: b.status === 'Pending' ? 'orange' : b.status === 'Confirmed' ? 'green' : 'red', fontWeight: 'bold'}}>
                                    {b.status}
                                </td>
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
};

export default MyBookings;