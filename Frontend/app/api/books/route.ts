import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Book } from "@/lib/models/Book";

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ message: "Server error fetching books" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const newBook = new Book(body);
    const savedBook = await newBook.save();
    return NextResponse.json(savedBook, { status: 201 });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json({ message: "Server error adding book" }, { status: 500 });
  }
}
