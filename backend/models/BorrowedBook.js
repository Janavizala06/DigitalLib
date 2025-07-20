const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
});

const BorrowedBook = mongoose.model('BorrowedBook', borrowedBookSchema);

module.exports = BorrowedBook;
