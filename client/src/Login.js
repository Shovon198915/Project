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
            // IMPORTANT: Ensure this Render URL is correct!
            const res = await fetch('https://project-r50m.onrender.com/api/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await res.json(); 

            if (res.ok) {
                
                // 1. Save Token and Email
                localStorage.setItem('token', data.token); 
                localStorage.setItem('userEmail', email); 
                
                // 2. Save isAdmin status (converted to string)
                if (data.user && data.user.isAdmin !== undefined) { 
                    localStorage.setItem('isAdmin', data.user.isAdmin.toString()); 
                } else {
                    localStorage.setItem('isAdmin', 'false');
                }
                // ---------------------------------------------------------------------------------

                alert("✅ Login Successful!");
                
                // --- FINAL FIX: Navigate home AND force a reload ---
                navigate('/'); 
                window.location.reload(); // THIS FORCES THE NAVBAR TO UPDATE
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