import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/Product";
import connectDB from "@/config/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
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

  // Parse FormData or JSON for id
  let id;
  try {
    const formData = await req.formData();
    id = formData.get("id");
  } catch {
    const body = await req.json();
    id = body.id;
  }

  if (!id) {
    return NextResponse.json({ success: false, message: "Missing product id" }, { status: 400 });
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 });
}