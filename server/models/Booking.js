const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String 
  },
  phone: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  guests: { 
    type: Number, 
    required: true 
  },
  // --- THIS IS THE NEW PART ---
  paymentMethod: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'Pending' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);