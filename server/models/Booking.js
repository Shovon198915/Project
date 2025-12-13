const mongoose = require('mongoose');

// Define the Mongoose Schema for a Booking
const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String, 
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['bKash', 'Nagad', 'Bank Transfer'], 
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Cancelled'],
    },
    
    // --- CRITICAL MANUAL PAYMENT VERIFICATION FIELDS ---
    senderPhone: { 
        type: String, 
        required: false, 
        default: 'N/A'
    },
    transactionId: { 
        type: String, 
        required: false, 
        default: 'N/A'
    },
    // --- Dynamic Price Fields ---
    pricePerPerson: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);