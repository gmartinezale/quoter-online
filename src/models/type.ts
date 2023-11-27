import { Category } from "@/entities/Category";
import { Product } from "@/entities/Product";
import { Document, Schema, model } from "mongoose";
import "./category";
import "./product";

interface IType extends Document {
  description: string;
  price: number;
  stock: number;
  visibilityStock: boolean;
  category: string | Category;
  product: string | Product;
  active: boolean;
}

const ProductSchema = new Schema<IType>(
  {
    description: String,
    price: Number,
    stock: Number,
    visibilityStock: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

let Type: any;
try {
  Type = model("Type");
} catch (error) {
  Type = model<IType>("Type", ProductSchema);
}

export default Type;
