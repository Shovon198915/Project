import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Bookings() {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    
    // --- GUARD LOGIC: CHECK IF USER IS LOGGED IN ---
    const user = localStorage.getItem('token'); // Look for the ID card

    useEffect(() => {
        // If no ID card found, kick them out
        if (!user) {
            alert("⚠️ You must Login to book a trip!");
            navigate('/login');
        }
    }, [user, navigate]);
    // -----------------------------------------------

    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        destination: 'Saint Martin',
        date: '',
        guests: 1,
        paymentMethod: '' 
    });

    useEffect(() => {
        fetch('https://tripdude-backend.onrender.com/api/destinations')
            .then(res => res.json())
            .then(data => setDestinations(data));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectPayment = (method) => {
        setFormData({ ...formData, paymentMethod: method });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.paymentMethod) {
            alert("⚠️ Please select a Payment Method!");
            return;
        }

        try {
            const res = await fetch('https://tripdude-backend.onrender.com/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert(`✅ Booking Confirmed with ${formData.paymentMethod}! We will contact you.`);
                navigate('/');
            } else {
                alert("❌ Booking Failed");
            }
        } catch (err) {
            alert("Server Error");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Confirm Your Trip</h2>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.section}>
                    <label>Full Name:</label>
                    <input type="text" name="customerName" onChange={handleChange} required style={styles.input} />

                    <label>Phone:</label>
                    <input type="tel" name="phone" onChange={handleChange} required style={styles.input} />

                    <label>Destination:</label>
                    <select name="destination" onChange={handleChange} style={styles.input}>
                        {destinations.map(dest => (
                            <option key={dest._id} value={dest.name}>{dest.name} - {dest.price} BDT</option>
                        ))}
                    </select>

                    <div style={{display:'flex', gap:'10px'}}>
                        <div style={{flex:1}}>
                            <label>Date:</label>
                            <input type="date" name="date" onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={{flex:1}}>
                            <label>Guests:</label>
                            <input type="number" name="guests" min="1" onChange={handleChange} style={styles.input} />
                        </div>
                    </div>
                </div>

                <h3 style={{marginTop: '20px'}}>Select Payment Method:</h3>
                <div style={styles.paymentGrid}>
                    <div style={{...styles.paymentCard, border: formData.paymentMethod === 'bKash' ? '3px solid #E2136E' : '1px solid #ddd'}} onClick={() => selectPayment('bKash')}>
                        <h4 style={{color: '#E2136E', margin:0}}>bKash</h4>
                    </div>
                    <div style={{...styles.paymentCard, border: formData.paymentMethod === 'Nagad' ? '3px solid #F7941D' : '1px solid #ddd'}} onClick={() => selectPayment('Nagad')}>
                        <h4 style={{color: '#F7941D', margin:0}}>Nagad</h4>
                    </div>
                    <div style={{...styles.paymentCard, border: formData.paymentMethod === 'Rocket' ? '3px solid #8C3494' : '1px solid #ddd'}} onClick={() => selectPayment('Rocket')}>
                        <h4 style={{color: '#8C3494', margin:0}}>Rocket</h4>
                    </div>
                    <div style={{...styles.paymentCard, border: formData.paymentMethod === 'Card' ? '3px solid #0056b3' : '1px solid #ddd'}} onClick={() => selectPayment('Card')}>
                        <h4 style={{color: '#0056b3', margin:0}}>Card</h4>
                    </div>
                </div>

                <button type="submit" style={styles.button}>Confirm & Pay</button>
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '600px', margin: '40px auto', padding: '30px', boxShadow: '0 0 15px rgba(0,0,0,0.1)', borderRadius: '15px', background: 'white' },
    form: { display: 'flex', flexDirection: 'column' },
    section: { display: 'flex', flexDirection: 'column' },
    input: { padding: '12px', margin: '5px 0 15px 0', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px' },
    paymentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' },
    paymentCard: { padding: '20px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', background: '#f9f9f9', transition: '0.3s' },
    button: { padding: '15px', background: '#222', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', marginTop: '20px', fontWeight: 'bold' }
};

export default Bookings;