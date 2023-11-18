import { Document, Schema, model } from "mongoose";

interface IPrice {
  description: string;
  price: number;
}

interface IProduct extends Document {
  name: string;
  prices: IPrice[];
  active: boolean;
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
