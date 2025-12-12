import React from 'react';

function Footer() {
    return (
        <div style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.section}>
                    <h3>Travelloop</h3>
                    <p>Your trusted travel partner in Bangladesh.</p>
                </div>
                <div style={styles.section}>
                    <h4>Contact</h4>
                    <p>📞 +880 1700 000000</p>
                    <p>📧 support@travelloop.com</p>
                    <p>📍 Dhaka, Bangladesh</p>
                </div>
                <div style={styles.section}>
                    <h4>Socials</h4>
                    <p>Facebook | Instagram | YouTube</p>
                </div>
            </div>
            <p style={styles.copyright}>© 2025 Travelloop. All rights reserved.</p>
        </div>
    );
}

const styles = {
    footer: { backgroundColor: '#222', color: 'white', padding: '40px 0', marginTop: '50px' },
    // --- FIX: Changed justifyContent to flex-start and added gap ---
    container: { 
        display: 'flex', 
        justifyContent: 'flex-start', // FIX: Clustered content to the left
        gap: '60px', // FIX: Added a fixed gap between columns (adjust 60px if needed)
        flexWrap: 'wrap', 
        maxWidth: '1200px', 
        margin: '0 auto',
        paddingLeft: '20px' // Small horizontal padding
    },
    // --- FIX: Reduced minWidth for tighter grouping ---
    section: { marginBottom: '20px', minWidth: '180px' }, // Reduced from 200px
    // --------------------------------------------------
    copyright: { textAlign: 'center', marginTop: '20px', borderTop: '1px solid #444', paddingTop: '20px', fontSize: '14px' }
};

export default Footer;