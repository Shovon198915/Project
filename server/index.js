require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- 1. NEW SECURITY TOOLS ---
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const Destination = require('./models/Destination');
const Booking = require('./models/Booking'); // Import Booking model
const User = require('./models/User'); // Import User model

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// SECRET KEY (In a real app, hide this in .env)
const JWT_SECRET = 'travelloop_secret_key_123';

// ===========================
//    AUTHENTICATION ROUTES
// ===========================

// 1. SIGN UP (Create Account)
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Scramble the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
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

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Create Token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        
        // Check if user is admin to send back isAdmin flag (for frontend dashboard visibility)
        const isAdmin = user.email === 'admin@travelloop.com'; 

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

// 1. CREATE BOOKING (Used by PaymentScreen.js)
// This POST route saves the full booking details including senderPhone/transactionId.
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        
        // Return savedBooking so frontend can update its state
        res.status(201).json({ message: "Booking Successful! Pending approval.", booking: savedBooking });
    } catch (err) {
        console.error("Error creating new booking:", err); 
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL BOOKINGS (For AdminDashboard.js)
// FIX: Defines the missing /api/bookings/all route correctly.
app.get('/api/bookings/all', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }); // Show newest first
        res.status(200).json(bookings);
    } catch (err) {
        console.error("Error fetching all bookings for Admin:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. GET USER BOOKINGS (For MyBookings.js)
app.get('/api/bookings/user/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE STATUS (Approve/Reject)
// FIX: Corrects the path to match the AdminDashboard.js PUT call: /api/bookings/:id/status
app.put('/api/bookings/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // We send "Confirmed" or "Cancelled"
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
//     SERVER START BLOCK (MOVED TO THE END)
// =============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));