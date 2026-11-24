import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models/Review";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const review = new Review(body);
    await review.save();
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
