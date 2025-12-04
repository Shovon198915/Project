import React, { useEffect, useState } from 'react';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const email = localStorage.getItem('userEmail'); // Get logged in email

    useEffect(() => {
        if (email) {
            // Fetch bookings for this specific user email
            fetch(`https://project-r50m.onrender.com/api/bookings/user/${email}`) // <- CHECK URL
                .then(res => res.json())
                .then(data => setBookings(data));
        }
    }, [email]);

    if (!email) return <h2 style={{textAlign:'center', marginTop:'50px'}}>Please Login to see your bookings.</h2>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>My Travel History</h2>
            {/* ... (List of bookings display goes here) ... */}
        </div>
    );
}

export default MyBookings;