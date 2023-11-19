import { Category } from "@/entities/Category";
import { Document, Schema, model } from "mongoose";
import "./category";

interface IPrice {
  description: string;
  price: number;
}

interface IProduct extends Document {
  name: string;
  prices: IPrice[];
  active: boolean;
  category: string | Category;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: String,
    active: Boolean,
    prices: [
      {
        description: String,
        price: Number,
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true },
);

let Product: any;
try {
  Product = model("Product");
} catch (error) {
  Product = model<IProduct>("Product", ProductSchema);
}

export default Product;
