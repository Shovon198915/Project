require('dotenv').config();
const connectDB = require('./config/db');
const Destination = require('./models/Destination');
const User = require('./models/User');
// --- 1. IMPORT BCRYPT (To scramble password) ---
const bcrypt = require('bcryptjs');

const destinations = [
    {
        name: "Saint Martin",
        location: "Cox's Bazar",
        description: "Bangladesh's only coral island with blue water and coconut groves.",
        price: 8000,
        imageUrl: "/assets/saintmartin.jpg" 
    },
    {
        name: "Sylhet",
        location: "Sylhet Division",
        description: "Famous for rolling tea gardens, Ratargul Swamp Forest, and waterfalls.",
        price: 5000,
        imageUrl: "/assets/sylhet.jpg"
    },
    {
        name: "Bandarban",
        location: "Chittagong Hill Tracts",
        description: "Home to the highest peaks (Tahjingdong, Keokradong) and beautiful lakes.",
        price: 7000,
        imageUrl: "/assets/bandarban.jpg"
    },
    {
        name: "Sajek Valley",
        location: "Rangamati",
        description: "Known as the Queen of Hills, famous for cloud watching.",
        price: 6500,
        imageUrl: "/assets/sajek.jpg"
    },
    {
        name: "Sundarbans",
        location: "Khulna",
        description: "The largest mangrove forest in the world, home of the Royal Bengal Tiger.",
        price: 12000,
        imageUrl: "/assets/sundarbans.jpg"
    },
    {
        name: "Kaptai Lake",
        location: "Rangamati",
        description: "The largest man-made lake in Bangladesh, perfect for kayaking.",
        price: 5500,
        imageUrl: "/assets/kaptai.jpg"
    }
];

const importData = async () => {
    try {
        await connectDB();
        
        // Clear old data
        await Destination.deleteMany();
        await User.deleteMany();

        // Insert Destinations
        await Destination.insertMany(destinations);

        // --- 2. CREATE SECURE ADMIN USER ---
        const salt = await bcrypt.genSalt(10);
        // This scrambles "admin123" into a secure code
        const hashedPassword = await bcrypt.hash("admin123", salt); 

        const adminUser = {
            email: "admin@tripdude.com",
            password: hashedPassword, // We save the scrambled version
            isAdmin: true
        };

        await User.create(adminUser);
        // -----------------------------------

        console.log('✅ Data Imported & Admin Password Secured!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

importData();