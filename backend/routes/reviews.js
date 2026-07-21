const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { authenticate } = require('../middleware/auth');

// POST /api/reviews - Add a review (authenticated)
router.post('/', authenticate, [
    body('bookId').notEmpty().withMessage('bookId is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').trim().notEmpty().withMessage('Review text is required')
        .isLength({ max: 2000 }).withMessage('Review must be under 2000 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
        const { bookId, rating, review } = req.body;

        // Verify book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const newReview = new Review({
            bookId,
            studentId: req.user._id,
            rating,
            review,
        });

        await newReview.save();
        await newReview.populate('studentId', 'name');

        res.status(201).json(newReview);
    } catch (error) {
        // Handle duplicate review error
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already reviewed this book' });
        }
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error adding review' });
    }
});

// GET /api/reviews/:bookId - Get all reviews for a book
router.get('/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId })
            .populate('studentId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
});

// DELETE /api/reviews/:id - Delete own review (authenticated)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only the author or a librarian can delete
        if (review.studentId.toString() !== req.user._id.toString() && req.user.role !== 'librarian') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error deleting review' });
    }
});

module.exports = router;