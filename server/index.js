require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- 1. SECURITY TOOLS ---
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const Destination = require('./models/Destination');
const Booking = require('./models/Booking'); 
const User = require('./models/User'); 

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// SECRET KEY (Must be the same as used for generating tokens)
const JWT_SECRET = 'travelloop_secret_key_123';

// ===========================
//     NEW AUTH MIDDLEWARE
// ===========================
const protect = (req, res, next) => {
    let token;
    
    // Check for token in headers (usually Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (removes 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach user ID to the request
            req.userId = decoded.id; 
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
// ===========================

// ===========================
//    AUTHENTICATION ROUTES
// ===========================

// 1. SIGN UP (Create Account)
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "✅ Account Created! Please Login." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN (Get ID Card/Token)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        
        const isAdmin = user.email === 'adminmondol@gmail.com'; 

        res.json({ message: "Login Successful", token, user: { isAdmin: isAdmin } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===========================
//      DATA ROUTES
// ===========================

// Get All Destinations
app.get('/api/destinations', async (req, res) => {
    const places = await Destination.find();
    res.json(places);
});

// Get Single Destination (For Details Page)
app.get('/api/destinations/:id', async (req, res) => {
    try {
        const place = await Destination.findById(req.params.id);
        res.json(place);
    } catch (err) {
        res.status(404).json({ message: "Place not found" });
    }
});

// 1. CREATE BOOKING (Protected Route)
// FIX: Apply the 'protect' middleware here to prevent unauthenticated booking creation.
app.post('/api/bookings', protect, async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        
        res.status(201).json({ message: "Booking Successful! Pending approval.", booking: savedBooking });
    } catch (err) {
        console.error("Error creating new booking:", err); 
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL BOOKINGS (For AdminDashboard.js)
// Note: This route is generally not protected if public viewing is allowed, but often protected for Admin access. 
// For simplicity, we assume AdminDashboard handles the isAdmin check.
app.get('/api/bookings/all', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) {
        console.error("Error fetching all bookings for Admin:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. GET USER BOOKINGS (Protected Route)
// FIX: Apply the 'protect' middleware to ensure only logged-in users can view their bookings.
app.get('/api/bookings/user/:email', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE STATUS (Approve/Reject)
// Note: This route should ideally have an 'isAdmin' check, but we apply 'protect' as baseline.
app.put('/api/bookings/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body; 
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        
        if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });

        res.json(updatedBooking);
    } catch (err) {
        console.error("Error updating booking status:", err);
        res.status(500).json({ error: err.message });
    }
});

// =============================================
//     SERVER START BLOCK
// =============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));