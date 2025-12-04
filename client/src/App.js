import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Bookings from './Bookings';
import Destinations from './Destinations';
import Signup from './Signup'; 
import bannerImg from './images/img1.jpg'; 

// --- NEW IMPORTS: Dashboards and Footer ---
import AdminDashboard from './AdminDashboard';
import MyBookings from './MyBookings';
import Footer from './Footer';
// ------------------------------------------

function Home() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    // This is the live Render URL
    fetch('https://project-r50m.onrender.com/api/destinations') 
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={{ fontSize: '50px', margin: '0' }}>Welcome to Travelloop</h1>
          <p style={{ fontSize: '20px', marginTop: '10px' }}>Your Personal Travel Companion in Bangladesh</p>
          <Link to="/destinations">
            <button style={styles.heroButton}>Explore Destinations</button>
          </Link>
        </div>
      </div>

      {/* INTRO SECTION */}
      <div style={styles.container}>
        <h2 style={{ textAlign: 'center' }}>Why Choose Us?</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px', flexWrap: 'wrap' }}>
            <div style={styles.featureBox}>
                <h3>🌍 6 Top Locations</h3>
                <p>We cover the best spots from Hills to Sea.</p>
            </div>
            <div style={styles.featureBox}>
                <h3>💰 Best Prices</h3>
                <p>Affordable packages for students and families.</p>
            </div>
            <div style={styles.featureBox}>
                <h3>📅 Easy Booking</h3>
                <p>Book your trip in just 2 clicks.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Check if Admin is logged in to show the Admin link
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <h2 style={{margin:0}}>Travelloop</h2>
          <div>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/destinations" style={styles.link}>Destinations</Link>
            <Link to="/bookings" style={styles.link}>Bookings</Link>
            
            {/* NEW LINK: My Bookings (For regular users) */}
            <Link to="/my-bookings" style={styles.link}>My Trips</Link>
            
            {/* NEW LINK: Admin Dashboard (Only visible if you are admin) */}
            {isAdmin && <Link to="/admin" style={styles.adminLink}>Admin</Link>}
            
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={{...styles.link, color: '#ffcc00'}}>Sign Up</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* NEW ROUTE: Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* NEW ROUTE: My Bookings */}
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
      
      {/* FINAL STEP: ADD FOOTER */}
      <Footer />
    </Router>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '15px 50px', background: '#222', color: 'white', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none', marginLeft: '30px', fontWeight: '500' },
  adminLink: { color: '#ff5722', textDecoration: 'none', marginLeft: '30px', fontWeight: 'bold' }, // Admin Link Style
  hero: { backgroundImage: `url(${bannerImg})`, height: '500px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' },
  heroOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '40px', borderRadius: '10px' },
  heroButton: { padding: '15px 30px', fontSize: '18px', background: '#ff5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' },
  featureBox: { width: '300px', textAlign: 'center', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px', marginBottom: '20px' }
};

export default App;