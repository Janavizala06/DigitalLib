const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login (signup)
router.post('/login', async (req, res) => {
    const { name, studentId, email, password, phone } = req.body;

    // Basic validation
    if (!name || !studentId || !email || !password) {
        return res.status(400).json({ message: 'Name, student ID, email and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ name, studentId, email, password, phone });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in /login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/signin (login)
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password (plain text comparison for now; consider hashing in production)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Return user data on successful login
        res.status(200).json({
            message: 'Login successful',
            user: {
                name: user.name,
                studentId: user.studentId,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error in /signin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/auth/users - Get all users (members)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

module.exports = router;
