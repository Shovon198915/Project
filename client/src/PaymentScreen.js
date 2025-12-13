import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentScreen() {
    const [senderPhone, setSenderPhone] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const navigate = useNavigate();

    const RENDER_API_URL = 'https://project-r50m.onrender.com';

    useEffect(() => {
        // Load temporary booking data when the component mounts
        const tempBookingData = localStorage.getItem('tempBookingData');
        if (tempBookingData) {
            setBookingDetails(JSON.parse(tempBookingData));
        } else {
            alert("No pending booking found. Please start a new booking.");
            navigate('/bookings');
        }
    }, [navigate]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (!bookingDetails) {
            alert("Error: Booking details missing. Please restart the booking process.");
            return;
        }

        const finalBookingData = {
            ...bookingDetails,
            senderPhone: senderPhone, 
            transactionId: transactionId, 
            status: 'Pending' 
        };

        try {
            const res = await fetch(`${RENDER_API_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalBookingData),
            });
            
            if (res.ok) {
                const newBookingData = await res.json();
                
                localStorage.setItem('bookingConfirmed', 'true');
                localStorage.setItem('newBookingDetails', JSON.stringify(newBookingData.booking)); 
                
                localStorage.removeItem('tempBookingData'); 
                
                alert("✅ Transaction details submitted! Booking is now Pending Admin Approval.");
                navigate('/my-bookings'); 
            } else {
                const errorData = await res.json();
                alert("Submission Failed: " + (errorData.message || "Please check your details."));
            }
        } catch (err) {
            console.error("Network error during final submission:", err);
            alert("Server Error: Cannot connect to the service.");
        }
    };

    if (!bookingDetails) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading Payment...</h2>;
    }
    
    // Determine the payment number/account based on the selected method
    let paymentNumber = '';
    if (bookingDetails.paymentMethod === 'bKash') paymentNumber = '017XXXXXXXX (Merchant)'; 
    if (bookingDetails.paymentMethod === 'Nagad') paymentNumber = '018XXXXXXXX (Personal)'; 
    if (bookingDetails.paymentMethod === 'Bank Transfer') paymentNumber = 'Account: 1234567890 (Bank: ABC Bank)'; 
    
    // Use the calculated values passed from Bookings.js
    const pricePerPerson = bookingDetails.pricePerPerson || 0;
    const totalPrice = bookingDetails.totalPrice || 0;

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center'}}>Complete Your Payment</h2>
            
            <div style={styles.paymentBox}>
                
                {/* --- DISPLAYING THE CALCULATED PRICE --- */}
                <h3 style={styles.totalDisplay}>
                    Total Amount Due: {totalPrice.toLocaleString()} BDT
                </h3>
                <p style={styles.detailsSummary}>
                    ({bookingDetails.guests} Guests x {pricePerPerson.toLocaleString()} BDT per person for {bookingDetails.destination})
                </p>
                {/* ------------------------------------- */}

                <p style={styles.instruction}>
                    Please send the payment using **{bookingDetails.paymentMethod}** to the following number/account:
                </p>
                
                <h3 style={styles.numberDisplay}>{paymentNumber}</h3>
                <p style={{color: 'red'}}>**IMPORTANT:** Only proceed after sending the money to this number.</p>
            </div>
            
            <h3 style={{marginTop: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>Step 2: Submit Transaction Details</h3>

            <form onSubmit={handlePaymentSubmit} style={styles.form}>
                
                <label style={styles.label}>Transaction ID (TxID) from {bookingDetails.paymentMethod}</label>
                <input 
                    type="text" 
                    value={transactionId} 
                    onChange={(e) => setTransactionId(e.target.value)} 
                    placeholder="E.g., 8A09Z2A5"
                    required 
                    style={styles.input} 
                />
                
                <label style={styles.label}>Your Sender Phone Number</label>
                <input 
                    type="tel" 
                    value={senderPhone} 
                    onChange={(e) => setSenderPhone(e.target.value)} 
                    placeholder="E.g., 017XXXXXXXX"
                    required 
                    style={styles.input} 
                />

                <button type="submit" style={styles.button}>Confirm Transaction & Submit Booking</button>
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '600px', margin: '50px auto', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px' },
    paymentBox: {
        backgroundColor: '#f9f9f9',
        border: '2px dashed #ff5722',
        padding: '25px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    instruction: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    numberDisplay: {
        fontSize: '24px',
        color: '#222',
        margin: '10px 0',
        fontWeight: 'bold',
    },
    totalDisplay: {
        fontSize: '28px',
        color: '#ff5722',
        marginBottom: '5px',
    },
    detailsSummary: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '20px',
    },
    form: { display: 'flex', flexDirection: 'column' },
    label: { marginTop: '15px', marginBottom: '5px', fontWeight: 'bold', color: '#333' },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' }
};

export default PaymentScreen;