const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active',
    },
}, { timestamps: true });

// Indexes for common queries
borrowedBookSchema.index({ studentId: 1, status: 1 });
borrowedBookSchema.index({ bookId: 1, status: 1 });
borrowedBookSchema.index({ studentId: 1, bookId: 1, status: 1 });

const BorrowedBook = mongoose.model('BorrowedBook', borrowedBookSchema);

module.exports = BorrowedBook;
