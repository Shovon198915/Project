function App() {
  // Check user status from local storage
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = localStorage.getItem('token'); // Check if a token exists

  // --- LOGOUT FUNCTION (Keep this!) ---
  const handleLogout = () => {
      // Remove all user-related items from storage
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
      
      // Force the browser to navigate to Home and refresh the Navbar
      window.location.href = '/'; 
  };
  // -------------------------------------

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <h2 style={{margin:0}}>Travelloop</h2>
          
          {/* LEFT-SIDE LINKS GROUP (Home, Destinations, Bookings) */}
          <div style={styles.leftLinks}> 
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/destinations" style={styles.link}>Destinations</Link>
            <Link to="/bookings" style={styles.link}>Bookings</Link>
          </div>
          
          {/* RIGHT-SIDE LINKS GROUP (My Trips, Admin, Login/Logout) */}
          <div style={styles.rightLinks}>
            
            {isLoggedIn && <Link to="/my-bookings" style={styles.link}>My Trips</Link>}
            {isAdmin && <Link to="/admin" style={styles.adminLink}>Admin</Link>}

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
          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
      
      <Footer />
    </Router>
  );
}

const styles = {
  // RESTORED: Uses space-between for the original layout
  navbar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '15px 50px', // Original large padding
    background: '#222', 
    color: 'white', 
    alignItems: 'center',
    margin: 0, 
  },
  // Added a container for the group of links on the left
  leftLinks: {
    display: 'flex',
    gap: '30px', // Spacing between Home/Destinations/Bookings
  },
  // Added a container for the group of links on the right
  rightLinks: {
    display: 'flex',
    gap: '30px', // Spacing between My Trips/Admin/Login/Logout
  },
  
  // RESTORED original large spacing on links
  link: { color: 'white', textDecoration: 'none', fontWeight: '500', margin: 0 },
  adminLink: { color: '#ff5722', textDecoration: 'none', fontWeight: 'bold', margin: 0 }, 
  logoutLink: { color: 'white', textDecoration: 'none', fontWeight: '500', cursor: 'pointer', margin: 0 },

  // RESTORED Footer and other main container styles
  hero: { backgroundImage: `url(${bannerImg})`, height: '500px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' },
  heroOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '40px', borderRadius: '10px' },
  heroButton: { padding: '15px 30px', fontSize: '18px', background: '#ff5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' },
  featureBox: { width: '300px', textAlign: 'center', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px', marginBottom: '20px' }
};

export default App;