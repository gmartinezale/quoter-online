import { Document, Schema, model } from "mongoose";
import { IProductPrice, ProductPriceSchema } from "@/interfaces/ProductInterface";

interface IProduct extends Document {
  name: string;
  price: number; // Base price
  types: IProductPrice[]; // Product types with individual prices
  finishes: IProductPrice[]; // Product finishes with individual prices
  extras?: IProductPrice[]; // Optional extras that can be added to quotation
  stock?: number; // Optional stock quantity
  minPurchase?: number; // Optional minimum purchase quantity
  active: boolean;
}

// Main product schema
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    types: { type: [ProductPriceSchema], default: [] },
    finishes: { type: [ProductPriceSchema], default: [] },
    extras: { type: [ProductPriceSchema], default: [] },
    stock: { type: Number, min: 0 },
    minPurchase: { type: Number, min: 1 },
    active: { type: Boolean, default: true },
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
