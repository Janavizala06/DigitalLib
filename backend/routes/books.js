const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Book = require('../models/Book');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/books - Get all books (with optional pagination and search)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const category = req.query.category || '';

        let filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } },
            ];
        }
        if (category) {
            filter.category = category;
        }

        const [books, total] = await Promise.all([
            Book.find(filter).skip(skip).limit(limit).sort({ addedDate: -1 }),
            Book.countDocuments(filter),
        ]);

        res.json({
            books,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Server error fetching books' });
    }
});

// POST /api/books - Add a new book (librarian only)
router.post('/', authenticate, requireRole('librarian'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('totalCopies').optional().isInt({ min: 0 }).withMessage('Total copies must be a non-negative integer'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
        // Destructure only allowed fields (prevent mass assignment)
        const { title, author, category, isbn, shelfNumber, totalCopies,
                coverUrl, description, publisher, language, format, pages, publishedYear } = req.body;

        const copies = totalCopies || 1;
        const newBook = new Book({
            title, author, category, isbn, shelfNumber,
            totalCopies: copies,
            availableCopies: copies,
            borrowedCopies: 0,
            coverUrl, description, publisher, language, format, pages, publishedYear,
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Server error adding book' });
    }
});

// PUT /api/books/:id - Update a book (librarian only)
router.put('/:id', authenticate, requireRole('librarian'), async (req, res) => {
    try {
        // Destructure only allowed fields (prevent mass assignment)
        const { title, author, category, isbn, shelfNumber, totalCopies,
                coverUrl, description, publisher, language, format, pages, publishedYear } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (author !== undefined) updateData.author = author;
        if (category !== undefined) updateData.category = category;
        if (isbn !== undefined) updateData.isbn = isbn;
        if (shelfNumber !== undefined) updateData.shelfNumber = shelfNumber;
        if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
        if (description !== undefined) updateData.description = description;
        if (publisher !== undefined) updateData.publisher = publisher;
        if (language !== undefined) updateData.language = language;
        if (format !== undefined) updateData.format = format;
        if (pages !== undefined) updateData.pages = pages;
        if (publishedYear !== undefined) updateData.publishedYear = publishedYear;

        // Handle totalCopies change — adjust availableCopies proportionally
        if (totalCopies !== undefined) {
            const book = await Book.findById(req.params.id);
            if (book) {
                const diff = totalCopies - book.totalCopies;
                updateData.totalCopies = totalCopies;
                updateData.availableCopies = Math.max(0, book.availableCopies + diff);
            }
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Server error updating book' });
    }
});

// DELETE /api/books/:id - Delete a book (librarian only)
router.delete('/:id', authenticate, requireRole('librarian'), async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Server error deleting book' });
    }
});

module.exports = router;
