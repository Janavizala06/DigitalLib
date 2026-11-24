import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BorrowedBook } from "@/lib/models/BorrowedBook";
import { Book } from "@/lib/models/Book";

export async function GET() {
  try {
    await connectDB();
    const borrowedBooks = await BorrowedBook.find().populate("bookId");
    return NextResponse.json(borrowedBooks);
  } catch (error) {
    console.error("Error fetching all borrowed books:", error);
    return NextResponse.json(
      { message: "Server error fetching all borrowed books" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { studentId, bookId } = await req.json();

    if (!studentId || !bookId) {
      return NextResponse.json(
        { message: "studentId and bookId are required" },
        { status: 400 }
      );
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    if (book.availableCopies < 1) {
      return NextResponse.json({ message: "No available copies to borrow" }, { status: 400 });
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const borrowedBook = new BorrowedBook({ studentId, bookId, borrowDate, dueDate });
    await borrowedBook.save();

    book.availableCopies -= 1;
    book.borrowedCopies += 1;
    await book.save();

    return NextResponse.json(borrowedBook, { status: 201 });
  } catch (error) {
    console.error("Error borrowing book:", error);
    return NextResponse.json({ message: "Server error borrowing book" }, { status: 500 });
  }
}
