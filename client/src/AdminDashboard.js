import React, { useEffect, useState } from 'react';

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);

    // Fetch all bookings when page loads
    useEffect(() => {
        fetch('https://project-r50m.onrender.com/api/bookings') 
            .then(res => res.json())
            .then(data => setBookings(data));
    }, []);

    // Function to update status
    const updateStatus = async (id, newStatus) => {
        await fetch(`https://project-r50m.onrender.com/api/bookings/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        // Refresh the list locally
        setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Admin Dashboard</h2>
            {/* ... (Table implementation goes here, using styles.p for padding) ... */}
            <p>Admin Table goes here...</p> 
            <small>Data will load when API call is successful.</small>
        </div>
    );
}

export default AdminDashboard;