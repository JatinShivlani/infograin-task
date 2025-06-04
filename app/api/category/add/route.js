import jwt from "jsonwebtoken";
import Category from "@/models/Category";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const { name, description } = await req.json();

    // Check if category already exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }

    const category = new Category({ name, description });
    await category.save();

    return NextResponse.json(
      { success: true, category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid token or server error" },
      { status: 401 }
    );
  }
}