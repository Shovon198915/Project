import React, { useEffect, useState } from 'react';

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get your Render URL from your browser's address bar (e.g., https://project-r50m.onrender.com)
    const RENDER_API_URL = 'https://project-r50m.onrender.com'; 

    // Function to fetch all bookings
    const fetchBookings = () => {
        setLoading(true);
        fetch(`${RENDER_API_URL}/api/bookings`) // GET ALL BOOKINGS ROUTE
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching bookings:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        // Fetch when the component mounts
        fetchBookings();
    }, []);

    // Function to update status (Confirm/Cancel)
    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${RENDER_API_URL}/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update the local state instantly without a full page reload
                setBookings(bookings.map(b => 
                    b._id === id ? { ...b, status: newStatus } : b
                ));
                alert(`Booking ${id.substring(0, 5)}... has been ${newStatus.toLowerCase()}.`);
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            alert("Network error: Could not connect to the server.");
        }
    };

    if (loading) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading Bookings...</h2>;
    }

    if (bookings.length === 0) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>No Bookings Found.</h2>;
    }

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center'}}>Admin Dashboard</h2>
            <p style={{textAlign: 'center', marginBottom: '30px', color: '#555'}}>{bookings.length} Total Bookings Found</p>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Customer</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Destination</th>
                        <th style={styles.th}>Guests</th>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b._id}>
                            <td style={styles.td}>{b._id.substring(0, 5)}...</td>
                            <td style={styles.td}>{b.customerName}</td>
                            <td style={styles.td}>{b.email}</td>
                            <td style={styles.td}>{b.destination}</td>
                            <td style={styles.td}>{b.guests}</td>
                            <td style={styles.td}>{new Date(b.date).toLocaleDateString()}</td>
                            <td style={{...styles.td, color: b.status === 'Pending' ? 'orange' : b.status === 'Confirmed' ? 'green' : 'red', fontWeight: 'bold'}}>
                                {b.status}
                            </td>
                            <td style={styles.td}>
                                {b.status === 'Pending' && (
                                    <>
                                        <button 
                                            onClick={() => updateStatus(b._id, 'Confirmed')} 
                                            style={{...styles.button, backgroundColor: '#4CAF50'}}
                                        >
                                            ✔ Confirm
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(b._id, 'Cancelled')} 
                                            style={{...styles.button, backgroundColor: '#f44336', marginLeft: '5px'}}
                                        >
                                            ✖ Cancel
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1200px', margin: '50px auto', padding: '0 20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { border: '1px solid #ddd', padding: '12px', textAlign: 'left' },
    button: { color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }
};

export default AdminDashboard;