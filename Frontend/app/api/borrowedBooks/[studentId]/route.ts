import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BorrowedBook } from "@/lib/models/BorrowedBook";

export async function GET(req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  try {
    await connectDB();
    const { studentId } = await params;
    const borrowedBooks = await BorrowedBook.find({ studentId }).populate("bookId");
    return NextResponse.json(borrowedBooks);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return NextResponse.json(
      { message: "Server error fetching borrowed books" },
      { status: 500 }
    );
  }
}
