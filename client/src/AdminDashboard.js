import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // IMPORTANT: Ensure this Render URL is correct!
    const RENDER_API_URL = 'https://project-r50m.onrender.com';

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('token'); // <-- NEW: Get the JWT token

    const fetchBookings = async () => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${RENDER_API_URL}/api/bookings/all`);
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! Status: ${res.status}. Response: ${errorText.substring(0, 50)}...`);
            }
            
            const data = await res.json();
            
            const sortedBookings = data.sort((a, b) => {
                if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                if (a.status !== 'Pending' && b.status === 'Pending') return 1;
                return 0;
            });

            setBookings(sortedBookings);
        } catch (err) {
            console.error("Failed to fetch bookings:", err.message);
            
            const alertMessage = "Failed to fetch bookings. Your Render backend server might be asleep, or the API route is broken. Please visit your backend URL (in a new tab) to wake it up, and then refresh this page.";
            alert(alertMessage);
            
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchBookings();
    }, [isAdmin, navigate]);

    // --- CRITICAL FIX APPLIED HERE ---
    const handleUpdateStatus = async (id, newStatus) => {
        if (!token) {
            alert("Security Error: Admin session expired. Please log in again.");
            navigate('/login');
            return;
        }
        
        if (!window.confirm(`Are you sure you want to change the status of booking ${id} to ${newStatus}?`)) {
            return;
        }

        try {
            const res = await fetch(`${RENDER_API_URL}/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    // FIX: Add Authorization header with the JWT token
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert(`Status updated to ${newStatus}!`);
                fetchBookings();
            } else {
                const errorData = await res.json();
                // Improved error message for unauthorized attempts
                if (res.status === 401) {
                    alert("Authorization Failed: You may not have admin privileges or your token is expired.");
                } else {
                    alert("Failed to update status: " + (errorData.message || "Server error."));
                }
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("A network error occurred while updating status.");
        }
    };

    if (loading) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading Admin Dashboard...</h2>;
    }

    if (!isAdmin) {
        return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Access Denied.</h2>;
    }

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Admin Dashboard - All Bookings ({bookings.length})</h2>

            {bookings.length === 0 ? (
                <p style={{textAlign: 'center', fontSize: '18px', color: '#ff5722'}}>
                    No bookings found.
                </p>
            ) : (
                <div style={{overflowX: 'auto'}}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>No.</th>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Destination</th>
                                <th style={styles.th}>Guests</th>
                                <th style={styles.th}>Payment Method</th>
                                
                                <th style={styles.th}>Sender Phone</th>
                                <th style={styles.th}>TxID</th>
                                
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b, index) => (
                                <tr key={b._id}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td style={styles.td}>{b.customerName}</td>
                                    <td style={styles.td}>{b.destination}</td>
                                    <td style={styles.td}>{b.guests}</td>
                                    <td style={styles.td}>{b.paymentMethod}</td>
                                    
                                    <td style={styles.td}>{b.senderPhone || 'N/A'}</td>
                                    <td style={styles.td}>{b.transactionId || 'N/A'}</td>

                                    <td style={{...styles.td, color: b.status === 'Pending' ? 'orange' : b.status === 'Confirmed' ? 'green' : 'red', fontWeight: 'bold'}}>
                                        {b.status}
                                    </td>
                                    <td style={styles.td}>
                                        {b.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(b._id, 'Confirmed')} 
                                                style={styles.confirmButton}
                                            >
                                                ✔ Confirm
                                            </button>
                                        )}
                                        {b.status !== 'Cancelled' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(b._id, 'Cancelled')} 
                                                style={styles.cancelButton}
                                            >
                                                X Cancel
                                            </button>
                                        )}
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
    container: { maxWidth: '1200px', margin: '50px auto', padding: '0 20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', minWidth: '900px' },
    th: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', whiteSpace: 'nowrap' },
    td: { border: '1px solid #ddd', padding: '12px', textAlign: 'left' },
    confirmButton: { padding: '8px 12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    cancelButton: { padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default AdminDashboard;