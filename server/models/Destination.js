const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema({
    name: { type: String, required: true },  // e.g., "Saint Martin"
    location: { type: String, required: true }, // e.g., "Bay of Bengal"
    description: { type: String, required: true },
    price: { type: Number, required: true },    // e.g., 8000
    imageUrl: { type: String, required: true }, // Link to picture
    rating: { type: Number, default: 0, max: 5 } // Optional star rating
}, {
    timestamps: true // Adds 'createdAt' time automatically
});

module.exports = mongoose.model('Destination', destinationSchema);