const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    isbn: { type: String, trim: true, sparse: true },
    shelfNumber: { type: String, trim: true },
    totalCopies: { type: Number, default: 1, min: 0 },
    availableCopies: { type: Number, default: 1, min: 0 },
    borrowedCopies: { type: Number, default: 0, min: 0 },
    coverUrl: { type: String },
    addedDate: { type: Date, default: Date.now },
    description: { type: String },
    publisher: { type: String, trim: true },
    language: { type: String, trim: true },
    format: { type: String, trim: true },
    pages: { type: Number, min: 0 },
    publishedYear: { type: Number },
});

// Add indexes for common queries
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ isbn: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
