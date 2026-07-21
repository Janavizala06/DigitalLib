require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const borrowedBooksRoutes = require('./routes/borrowedBooks');
const reviewRoutes = require('./routes/reviews');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 auth requests per window
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/borrowedBooks', borrowedBooksRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB and seed default librarian
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Seed default librarian user
        const librarianEmail = process.env.LIBRARIAN_EMAIL || 'librarian@gmail.com';
        const librarianPassword = process.env.LIBRARIAN_PASSWORD || 'admin123';

        try {
            const existingLibrarian = await User.findOne({ email: librarianEmail });
            if (!existingLibrarian) {
                const newLibrarian = new User({
                    name: 'Librarian Admin',
                    studentId: 'LIB001',
                    email: librarianEmail,
                    password: librarianPassword,
                    role: 'librarian',
                });
                await newLibrarian.save();
                console.log(`Default librarian created with email: ${librarianEmail}`);
            } else {
                console.log(`Default librarian already exists: ${librarianEmail}`);
            }
        } catch (seedError) {
            console.error('Error seeding librarian:', seedError.message);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });
