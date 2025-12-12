import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure this image exists, or remove the import if you don't have it
import loginBg from './images/img1.jpg';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // --- FIX 1: Corrected the broken URL ---
            const res = await fetch('https://project-r50m.onrender.com/api/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            // Get the data once
            const data = await res.json(); 

            if (res.ok) {
                
                // --- FIX 2 & 3: Save Token, Email, and Admin Status (CRUCIAL for Dashboards) ---
                localStorage.setItem('token', data.token); 
                localStorage.setItem('userEmail', email); // Save email for My Trips page
                
                // Check if user object exists before saving isAdmin flag
                if (data.user && data.user.isAdmin !== undefined) { 
                    localStorage.setItem('isAdmin', data.user.isAdmin); 
                }
                // ---------------------------------------------------------------------------------

                alert("✅ Login Successful!");
                navigate('/'); // Go back to Home
            } else {
                // Show the actual message from the server (e.g., "Invalid Credentials")
                alert("❌ " + (data.message || "Login Failed. Check your connection."));
            }
        } catch (err) {
            // This captures network errors (server is asleep or offline)
            alert("Server Error: Cannot connect to the service. Please try again."); 
        }
    };

    return (
        <div style={styles.background}>
            <div style={styles.overlay}>
                <div style={styles.loginBox}>
                    <h2 style={{color: '#333'}}>Welcome Back</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                        <button type="submit" style={styles.button}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    background: {
        // If you don't have an image, you can change this to: backgroundColor: '#f0f2f5',
        backgroundImage: `url(${loginBg})`,
        height: '100vh', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    overlay: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginBox: {
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd' },
    button: { padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;