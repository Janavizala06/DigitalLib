const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, requireRole } = require('../middleware/auth');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/auth/register - Register a new user
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('studentId').trim().notEmpty().withMessage('Student ID is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
        const { name, studentId, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'Email already registered' });
            }
            return res.status(409).json({ message: 'Student ID already registered' });
        }

        // Create new user (password hashed by pre-save hook)
        const newUser = new User({ name, studentId, email, password, phone, role: 'student' });
        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: newUser.toJSON(),
        });
    } catch (error) {
        console.error('Error in /register:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login - Login user
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find user by email (include password for comparison)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Error in /login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authenticate, async (req, res) => {
    res.json({ user: req.user });
});

// GET /api/auth/users - Get all users (librarian only)
router.get('/users', authenticate, requireRole('librarian'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// PUT /api/auth/users/:id - Update a user (librarian only)
router.put('/users/:id', authenticate, requireRole('librarian'), async (req, res) => {
    try {
        const { name, email, phone, studentId } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, studentId },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error updating user' });
    }
});

module.exports = router;
