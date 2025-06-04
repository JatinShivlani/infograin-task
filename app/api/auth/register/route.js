import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "../../../../config/db";
import { NextResponse } from "next/server";

// Simple DB connect (for demonstration; use a separate util in production)

export async function POST(request) {
    await connectDB();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return NextResponse.json(
        {
            success: true,
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        },
        { status: 201 }
    );
}
