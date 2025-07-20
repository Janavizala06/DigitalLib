require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const User = require('./models/User');
const borrowedBooksRoutes = require('./routes/borrowedBooks');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/borrowedBooks', borrowedBooksRoutes);
app.use('/api/reviews', reviewRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check if default librarian user exists
        const librarianEmail = "librarian@gmail.com";
        const librarianPassword = "admin123"; // preset password

        const existingLibrarian = await User.findOne({ email: librarianEmail });
        if (!existingLibrarian) {
            const newLibrarian = new User({
                email: librarianEmail,
                password: librarianPassword,
            });
            await newLibrarian.save();
            console.log(`Default librarian user created with email: ${librarianEmail}`);
        } else {
            console.log(`Default librarian user already exists with email: ${librarianEmail}`);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
