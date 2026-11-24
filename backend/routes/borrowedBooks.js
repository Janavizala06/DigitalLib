const express = require('express');
const router = express.Router();
const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');

// POST /api/borrowedBooks - Add a borrowed book record
router.post('/', async (req, res) => {
    try {
        const { studentId, bookId } = req.body;
        if (!studentId || !bookId) {
            return res.status(400).json({ message: 'studentId and bookId are required' });
        }

        // Check if book is available
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.availableCopies < 1) {
            return res.status(400).json({ message: 'No available copies to borrow' });
        }

        // Create borrowed book record
        const borrowDate = new Date();
        const dueDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from borrowDate

        const borrowedBook = new BorrowedBook({
            studentId,
            bookId,
            borrowDate,
            dueDate,
        });

        await borrowedBook.save();

        // Update book copies
        book.availableCopies -= 1;
        book.borrowedCopies += 1;
        await book.save();

        res.status(201).json(borrowedBook);
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ message: 'Server error borrowing book' });
    }
});

// GET /api/borrowedBooks/:studentId - Get borrowed books for a student
router.get('/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const borrowedBooks = await BorrowedBook.find({ studentId }).populate('bookId');
        res.json(borrowedBooks);
    } catch (error) {
        console.error('Error fetching borrowed books:', error);
        res.status(500).json({ message: 'Server error fetching borrowed books' });
    }
});

// GET /api/borrowedBooks - Get all borrowed books (for librarian dashboard)
router.get('/', async (req, res) => {
    try {
        const borrowedBooks = await BorrowedBook.find().populate('bookId');
        res.json(borrowedBooks);
    } catch (error) {
        console.error('Error fetching all borrowed books:', error);
        res.status(500).json({ message: 'Server error fetching all borrowed books' });
    }
});

module.exports = router;
