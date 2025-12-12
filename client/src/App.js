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
  // Check user status from local storage
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = localStorage.getItem('token'); // Check if a token exists

  // --- NEW LOGOUT FUNCTION ---
  const handleLogout = () => {
      // Remove all user-related items from storage
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
      
      // Force the browser to navigate to Home and refresh the Navbar
      window.location.href = '/'; 
  };
  // ---------------------------

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <h2 style={{margin:0}}>Travelloop</h2>
          <div style={styles.navLinks}> 
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/destinations" style={styles.link}>Destinations</Link>
            <Link to="/bookings" style={styles.link}>Bookings</Link>
            
            {/* Show My Trips only if logged in */}
            {isLoggedIn && <Link to="/my-bookings" style={styles.link}>My Trips</Link>}
            
            {/* Show Admin Dashboard only if Admin */}
            {isAdmin && <Link to="/admin" style={styles.adminLink}>Admin</Link>}

            {/* CONDITIONAL LOGIN/LOGOUT BUTTONS */}
            {isLoggedIn ? (
                // Show Log Out if user is logged in
                <a onClick={handleLogout} style={styles.logoutLink}>Log Out</a> 
            ) : (
                // Show Login/Signup if user is logged out
                <>
                    <Link to="/login" style={styles.link}>Login</Link>
                    <Link to="/signup" style={{...styles.link, color: '#ffcc00'}}>Sign Up</Link>
                </>
            )}
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
  // --- FIX 1: Navbar Spacing - Reduced all margins significantly ---
  navbar: { 
    display: 'flex', 
    justifyContent: 'flex-start', 
    padding: '15px 15px', // FURTHER REDUCED horizontal padding (from 30px to 15px)
    background: '#222', 
    color: 'white', 
    alignItems: 'center' 
  },
  navLinks: {
    marginLeft: '15px', // FURTHER REDUCED space between logo and links (from 30px to 15px)
  },
  link: { color: 'white', textDecoration: 'none', marginLeft: '10px', fontWeight: '500' }, // FURTHER REDUCED link spacing (from 20px to 10px)
  adminLink: { color: '#ff5722', textDecoration: 'none', marginLeft: '10px', fontWeight: 'bold' }, // FURTHER REDUCED link spacing
  logoutLink: { color: 'white', textDecoration: 'none', marginLeft: '10px', fontWeight: '500', cursor: 'pointer' }, // FURTHER REDUCED link spacing
  // --------------------------------------------------------------------------
  hero: { backgroundImage: `url(${bannerImg})`, height: '500px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' },
  heroOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '40px', borderRadius: '10px' },
  heroButton: { padding: '15px 30px', fontSize: '18px', background: '#ff5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' },
  // --- FIX 2: Reduced vertical padding on the main container ---
  container: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }, 
  // -------------------------------------------------------------
  featureBox: { width: '300px', textAlign: 'center', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px', marginBottom: '20px' }
};

export default App;