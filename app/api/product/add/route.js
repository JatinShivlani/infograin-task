import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/Product";
import connectDB from "@/config/db";
import { writeFile } from "fs/promises";
import path from "path";



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

  // Parse FormData
  const formData = await req.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const category = formData.get("category");
  const file = formData.get("image");

  if (!name || !price || !category) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  let image = "";
  if (file && typeof file === "object" && file.arrayBuffer) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "-" + file.name;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    image = `/uploads/${filename}`;
  }

  // Check if product already exists
  const existing = await Product.findOne({ name });
  if (existing) {
    return NextResponse.json({ success: false, message: "Product already exists" }, { status: 400 });
  }

  // Save product
  const product = new Product({ name, description, price, category, image });
  await product.save();

  return NextResponse.json({ success: true, product }, { status: 201 });
}