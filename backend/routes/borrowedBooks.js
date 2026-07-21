const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');
const { authenticate, requireRole } = require('../middleware/auth');

// POST /api/borrowedBooks - Borrow a book (authenticated)
router.post('/', authenticate, [
    body('bookId').notEmpty().withMessage('bookId is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { bookId } = req.body;
        const studentId = req.user._id;

        // Check for existing active borrow of this book by this user
        const existingBorrow = await BorrowedBook.findOne({
            studentId,
            bookId,
            status: 'active',
        });
        if (existingBorrow) {
            return res.status(400).json({ message: 'You have already borrowed this book' });
        }

        // Atomic operation to prevent race condition
        const book = await Book.findOneAndUpdate(
            { _id: bookId, availableCopies: { $gte: 1 } },
            { $inc: { availableCopies: -1, borrowedCopies: 1 } },
            { new: true }
        );

        if (!book) {
            return res.status(400).json({ message: 'Book not found or no available copies' });
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        const borrowedBook = new BorrowedBook({
            studentId,
            bookId,
            borrowDate,
            dueDate,
            status: 'active',
        });

        await borrowedBook.save();
        await borrowedBook.populate('bookId');

        res.status(201).json(borrowedBook);
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ message: 'Server error borrowing book' });
    }
});

// PUT /api/borrowedBooks/:id/return - Return a book (authenticated)
router.put('/:id/return', authenticate, async (req, res) => {
    try {
        const borrowedBook = await BorrowedBook.findById(req.params.id);
        if (!borrowedBook) {
            return res.status(404).json({ message: 'Borrowed book record not found' });
        }

        if (borrowedBook.status === 'returned') {
            return res.status(400).json({ message: 'Book already returned' });
        }

        // Only the borrower or a librarian can return
        if (borrowedBook.studentId.toString() !== req.user._id.toString() && req.user.role !== 'librarian') {
            return res.status(403).json({ message: 'Not authorized to return this book' });
        }

        // Update borrowed book record
        borrowedBook.status = 'returned';
        borrowedBook.returnDate = new Date();
        await borrowedBook.save();

        // Atomic update: restore available copies
        await Book.findByIdAndUpdate(borrowedBook.bookId, {
            $inc: { availableCopies: 1, borrowedCopies: -1 },
        });

        await borrowedBook.populate('bookId');

        res.json({ message: 'Book returned successfully', borrowedBook });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'Server error returning book' });
    }
});

// GET /api/borrowedBooks/my - Get current user's borrowed books
router.get('/my', authenticate, async (req, res) => {
    try {
        const borrowedBooks = await BorrowedBook.find({ studentId: req.user._id })
            .populate('bookId')
            .sort({ borrowDate: -1 });
        res.json(borrowedBooks);
    } catch (error) {
        console.error('Error fetching borrowed books:', error);
        res.status(500).json({ message: 'Server error fetching borrowed books' });
    }
});

// GET /api/borrowedBooks - Get all borrowed books (librarian only)
router.get('/', authenticate, requireRole('librarian'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const status = req.query.status || '';

        let filter = {};
        if (status) {
            filter.status = status;
        }

        const [borrowedBooks, total] = await Promise.all([
            BorrowedBook.find(filter)
                .populate('bookId')
                .populate('studentId', 'name email studentId')
                .skip(skip)
                .limit(limit)
                .sort({ borrowDate: -1 }),
            BorrowedBook.countDocuments(filter),
        ]);

        res.json({
            borrowedBooks,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Error fetching all borrowed books:', error);
        res.status(500).json({ message: 'Server error fetching all borrowed books' });
    }
});

module.exports = router;
