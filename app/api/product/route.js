import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/Product";
import connectDB from "@/config/db";

export async function GET(req) {
  await connectDB();

  // JWT verification
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  // Get all products
  const products = await Product.find();
  return NextResponse.json({ success: true, products }, { status: 200 });
}