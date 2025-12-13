import React, { useState, useEffect } from 'react'; // <-- Imported useEffect
import { useNavigate } from 'react-router-dom'; 

// --- CRITICAL FIX: Define price per person based on destination ---
const DESTINATION_PRICES = {
    "Cox's Bazar": 6000, 
    "Saint Martin": 8000, 
    "Sylhet": 5500,
    "Sajek Valley": 7000,
    "Sundarbans": 9000,
    "Bandarban": 6500,
    "Default": 5000 
};
// -------------------------------------------------------------------

function Bookings() {
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('bKash');
    
    const navigate = useNavigate(); 
    const isLoggedIn = localStorage.getItem('token'); 

    // NEW: Check if the user is logged in immediately upon component load
    useEffect(() => {
        if (!isLoggedIn) {
            alert("You must log in to access the booking form.");
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Final check before saving data for payment screen (redundant due to useEffect, but safe)
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            alert("Please log in to make a booking.");
            navigate('/login');
            return;
        }
        
        // --- FINAL PRICE CALCULATION LOGIC ---
        const pricePerPerson = DESTINATION_PRICES[destination] || DESTINATION_PRICES["Default"];
        const totalPrice = pricePerPerson * guests;
        // ------------------------------------

        const bookingData = {
            customerName,
            email: userEmail, // Stored email is used here
            phone,
            destination,
            date,
            guests,
            paymentMethod,
            pricePerPerson: pricePerPerson,
            totalPrice: totalPrice, 
            status: 'Pending' 
        };

        // Save Booking Data to LocalStorage for Payment Screen
        localStorage.setItem('tempBookingData', JSON.stringify(bookingData)); 
        
        alert(`Package Price: ${totalPrice.toLocaleString()} BDT. Redirecting to payment submission...`);
        navigate('/payment-confirm'); 
    };

    const currentPrice = (DESTINATION_PRICES[destination] || DESTINATION_PRICES["Default"]) * guests;

    // Show loading state while redirecting non-logged-in users
    if (!isLoggedIn) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Redirecting to Login...</h2>;
    }

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
                    
                    {Object.keys(DESTINATION_PRICES).filter(d => d !== 'Default').map(d => (
                         <option key={d} value={d}>{d} ({DESTINATION_PRICES[d].toLocaleString()} BDT/person)</option>
                    ))}
                    
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

                <button type="submit" style={styles.button}>
                    Proceed to Payment ({currentPrice.toLocaleString()} BDT)
                </button>
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