const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books - Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Server error fetching books' });
    }
});

// PUT /api/books/:id - Update a book
router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Server error updating book' });
    }
});

// POST /api/books - Add a new book
router.post('/', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Server error adding book' });
    }
});

module.exports = router;
