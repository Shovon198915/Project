import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://project-r50m.onrender.com/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert("✅ Account Created! Now please login.");
                navigate('/login');
            } else {
                alert("❌ " + data.message);
            }
        } catch (err) { alert("Error connecting to server"); }
    };

    return (
        <div style={styles.container}>
            <h2>Create an Account</h2>
            <form onSubmit={handleSignup} style={styles.form}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                <button type="submit" style={styles.button}>Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}

const styles = {
    container: { maxWidth: '400px', margin: '50px auto', textAlign: 'center', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', marginBottom: '10px' },
    button: { padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }
};

export default Signup;