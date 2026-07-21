const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate reviews: one review per user per book
reviewSchema.index({ bookId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);