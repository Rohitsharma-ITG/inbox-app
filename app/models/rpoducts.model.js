import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true }, 
  title: { type: String, required: true },
  image: { type: String },
  price: { type: String },
}, { timestamps: true });

const Rproduct = mongoose.model("Rproduct", productSchema);

export default Rproduct;
