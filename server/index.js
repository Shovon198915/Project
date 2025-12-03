require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// --- 1. NEW SECURITY TOOLS ---
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const Destination = require('./models/Destination');
const Booking = require('./models/Booking');
const User = require('./models/User'); // Import User model

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// SECRET KEY (In a real app, hide this in .env)
const JWT_SECRET = 'tripdude_secret_key_123';

// ===========================
//    AUTHENTICATION ROUTES
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

        res.json({ message: "Login Successful", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===========================
//      DATA ROUTES
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

// Create Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.json({ message: "Booking Successful!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));