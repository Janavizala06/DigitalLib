import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models/Review";

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    await connectDB();
    const { bookId } = await params;
    const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
