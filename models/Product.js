import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    // Store the image file path or filename as a string
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;