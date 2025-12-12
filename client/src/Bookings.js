import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import loginBg from './images/img1.jpg'; // Assuming you still have this unused import

function Bookings() {
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('bKash');
    
    const navigate = useNavigate(); 

    // IMPORTANT: Get your Render URL
    const RENDER_API_URL = 'https://project-r50m.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            alert("Please log in to make a booking.");
            navigate('/login');
            return;
        }

        const bookingData = {
            customerName,
            email: userEmail,
            phone,
            destination,
            date,
            guests,
            paymentMethod,
            status: 'Pending' 
        };

        try {
            const res = await fetch(`${RENDER_API_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            
            if (res.ok) {
                const newBookingData = await res.json();
                
                // Save Confirmation Details with correct keys
                localStorage.setItem('bookingConfirmed', 'true');
                localStorage.setItem('newBookingDetails', JSON.stringify(newBookingData.booking)); 
                
                alert("✅ Booking Successful! Redirecting to My Trips...");
                
                // CRITICAL FLOW FIX: Only navigate.
                navigate('/my-bookings'); 
            } else {
                const errorData = await res.json();
                alert("Booking Failed: " + (errorData.message || "Please check your details and try again."));
            }
        } catch (err) {
            console.error("Network error during booking:", err);
            alert("Server Error: Cannot connect to the booking service.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: 'center' }}>Book Your Trip</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                
                <label style={styles.label}>Full Name</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required style={styles.input} />
                
                <label style={styles.label}>Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={styles.input} />

                <label style={styles.label}>Destination</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} required style={styles.input}>
                    <option value="">Select a Destination</option>
                    
                    {/* --- FINAL FIX: ALL 6 DESTINATIONS ARE HERE --- */}
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Saint Martin">Saint Martin</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Sajek Valley">Sajek Valley</option>
                    <option value="Sundarbans">Sundarbans</option>
                    <option value="Bandarban">Bandarban</option>
                    {/* ----------------------------------------------- */}
                    
                </select>

                <label style={styles.label}>Travel Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={styles.input} />

                <label style={styles.label}>Number of Guests</label>
                <input type="number" value={guests} min="1" onChange={(e) => setGuests(parseInt(e.target.value))} required style={styles.input} />
                
                <label style={styles.label}>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required style={styles.input}>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>

                <button type="submit" style={styles.button}>Confirm Booking</button>
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '500px', margin: '50px auto', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px' },
    form: { display: 'flex', flexDirection: 'column' },
    label: { marginTop: '15px', marginBottom: '5px', fontWeight: 'bold', color: '#333' },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '15px', background: '#ff5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' }
};

export default Bookings;