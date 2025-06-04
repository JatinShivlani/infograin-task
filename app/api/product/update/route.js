import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/Product";
import connectDB from "@/config/db";
import { writeFile } from "fs/promises";
import path from "path";


// Optional: Add GET for testing in browser
export async function GET() {
  return NextResponse.json({ success: true, message: "GET method works. Use POST to update product." });
}

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
  const id = formData.get("_id");
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const category = formData.get("category");
  const file = formData.get("image");

  if (!id || !name || !price || !category) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  let image;
  if (file && typeof file === "object" && file.arrayBuffer) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "-" + file.name;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    image = `/uploads/${filename}`;
  }

  // Find and update the product
  const updateData = { name, description, price, category };
  if (image) updateData.image = image;

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

  if (!updatedProduct) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
}

// Optional: Handle unsupported methods (405)
export default function handler(req) {
  return NextResponse.json({ success: false, message: `Method ${req.method} Not Allowed` }, { status: 405 });
}