const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },
    isbn: { type: String },
    shelfNumber: { type: String },
    totalCopies: { type: Number, default: 1 },
    availableCopies: { type: Number, default: 1 },
    borrowedCopies: { type: Number, default: 0 },
    coverUrl: { type: String },
    addedDate: { type: Date, default: Date.now },
    description: { type: String },
    publisher: { type: String },
    language: { type: String },
    format: { type: String },
    pages: { type: Number },
    publishedYear: { type: Number },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
