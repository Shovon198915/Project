import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for search input

  useEffect(() => {
    // Fetch all destinations
    // CHECK YOUR RENDER URL and replace if necessary!
    fetch('https://project-r50m.onrender.com/api/destinations') 
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // --- FILTER LOGIC (NEW) ---
  // This filters the list based on the search term in the name or location
  const filteredDestinations = destinations.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    place.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Explore All 6 Destinations</h2>
      
      {/* SEARCH BAR UI (NEW) */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input 
            type="text" 
            placeholder="Search places (e.g. Sylhet) or location..." 
            style={styles.searchBar}
            onChange={(e) => setSearchTerm(e.target.value)} // <-- Updates search state
            value={searchTerm}
        />
      </div>
      
      <div style={styles.grid}>
        {/* WE MAP OVER THE FILTERED LIST */}
        {filteredDestinations.map(place => (
          <div key={place._id} style={styles.card}>
            <img src={place.imageUrl} alt={place.name} style={styles.image} />
            <div style={styles.info}>
              <h3>{place.name}</h3>
              <p style={{ color: '#555', fontSize: '14px' }}>{place.description}</p>
              <p><strong>Location:</strong> {place.location}</p>
              <p style={{ color: 'blue', fontSize: '18px' }}><strong>{place.price} BDT</strong></p>
              
              <Link to="/bookings">
                <button style={styles.button}>Book This Trip</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  // NEW STYLE FOR SEARCH BAR
  searchBar: { padding: '10px', width: '350px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '16px' }, 
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '30px' 
  },
  card: { border: '1px solid #ddd', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', transition: '0.3s', backgroundColor: 'white' },
  image: { width: '100%', height: '250px', objectFit: 'cover' },
  info: { padding: '20px', textAlign: 'center' },
  button: { background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', marginTop: '15px', cursor: 'pointer' }
};

export default Destinations;